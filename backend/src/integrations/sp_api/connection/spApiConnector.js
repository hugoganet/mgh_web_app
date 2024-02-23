require('dotenv').config({ path: 'backend/.env' });
const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('../../../utils/logger');
const Bottleneck = require('bottleneck');

/**
 * @class SpApiConnector
 * @classdesc A class for connecting to the Amazon Selling Partner API.
 */
class SpApiConnector {
  /**
   * @constructor
   * @param {*} clientId
   * @param {*} clientSecret
   * @param {*} refreshToken
   */
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.tokenExpiration = null;

    // Initialize a global Bottleneck Group manager
    this.limiterGroup = new Bottleneck.Group({
      // Default settings for all limiters created by this group
      maxConcurrent: 1, // Adjust based on the general case if needed
      // highWater: 0, // Disable pre-emptive queueing
      // strategy: Bottleneck.strategy., // Strategy to handle overflowing requests
    });
  }

  /**
   * Fetches a Login with Amazon (LWA) access token using the provided credentials.
   *
   * @async
   * @function getLWAToken
   * @param {string} clientId - The client ID for Amazon SP API access.
   * @param {string} clientSecret - The client secret for Amazon SP API access.
   * @param {string} refreshToken - The refresh token for generating a new LWA token.
   * @return {Promise<string>} A promise that resolves to the LWA access token.
   */
  async getLWAToken() {
    // Check if the existing token is still valid
    if (this.accessToken && new Date() < this.tokenExpiration) {
      return this.accessToken;
    }

    // Token is either null or expired, fetch a new one
    const url = 'https://api.amazon.com/auth/o2/token';
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };

    try {
      const response = await axios.post(url, payload);
      this.accessToken = response.data.access_token;

      // Assuming the token is valid for 1 hour, set expiration 5 minutes earlier as a buffer
      this.tokenExpiration = new Date(new Date().getTime() + 55 * 60 * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Error fetching LWA Token:', error);
      throw error;
    }
  }

  /**
   * @async
   * @function getGrantlessOperationToken
   * @description Fetches a grantless operation access token using the provided credentials.
   * @return {Promise<string>} A promise that resolves to the grantless operation access token.
   */
  async getGrantlessOperationToken() {
    // Define the scope for grantless operations (e.g., "sellingpartnerapi::notifications")
    const scope = 'sellingpartnerapi::notifications'; // Adjust the scope as needed

    // Check if the existing grantless operation token is still valid
    if (
      this.grantlessAccessToken &&
      new Date() < this.grantlessTokenExpiration
    ) {
      return this.grantlessAccessToken;
    }

    // Token is either null or expired, fetch a new one
    const url = 'https://api.amazon.com/auth/o2/token';
    const payload = {
      grant_type: 'client_credentials',
      scope: scope,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };

    try {
      const response = await axios.post(url, payload);
      this.grantlessAccessToken = response.data.access_token;

      // Assuming the token is valid for 1 hour, set expiration 5 minutes earlier as a buffer
      this.grantlessTokenExpiration = new Date(
        new Date().getTime() + 55 * 60 * 1000,
      );

      return this.grantlessAccessToken;
    } catch (error) {
      console.error('Error fetching Grantless Operation Token:', error);
      throw error;
    }
  }

  /**
   * Creates a canonical request string for AWS signature version 4 signing process.
   *
   * @function createCanonicalRequest
   * @param {string} method - HTTP method (GET, POST, etc.).
   * @param {string} endpoint - Service endpoint URL.
   * @param {string} path - Request path or URI.
   * @param {string} queryString - Query string parameters.
   * @param {string} pathParameter - Additional path parameters.
   * @param {string} accessToken - LWA access token for AWS authentication.
   * @param {string} date - Current date in a specific format.
   * @return {string} Canonical request string.
   */
  createCanonicalRequest(
    method,
    endpoint,
    path,
    queryString,
    pathParameter,
    accessToken,
    date,
  ) {
    const requestHeaders =
      `host:sellingpartnerapi-eu.amazon.com\n` +
      `User-Agent: MyApp/1.0 (Platform=Node.js; Language=JavaScript)\n` +
      `x-amz-access-token:${accessToken}\n` +
      `x-amz-date:${date}\n`;

    const canonicalRequest = [
      method,
      endpoint,
      path,
      queryString,
      pathParameter,
      requestHeaders,
    ].join('\n');

    return canonicalRequest;
  }

  /**
   * Generates a string to be signed as part of AWS signature version 4 process.
   *
   * @function createStringToSign
   * @param {string} canonicalRequest - The canonical request string.
   * @param {string} date - Current date in a specific format.
   * @param {string} region - AWS region code (e.g., "us-west-1").
   * @param {string} service - The AWS service being accessed.
   * @return {string} String to be signed.
   */
  createStringToSign(canonicalRequest, date, region, service) {
    const hashedCanonicalRequest = crypto
      .createHash('sha256')
      .update(canonicalRequest)
      .digest('hex');
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      date,
      `${date}/${region}/${service}/aws4_request`,
      hashedCanonicalRequest,
    ].join('\n');

    return stringToSign;
  }

  /**
   * Calculates the AWS signature for the provided string to sign.
   *
   * @function getSignature
   * @param {string} secretKey - AWS secret access key.
   * @param {string} date - Current date in YYYYMMDD format.
   * @param {string} region - AWS region name.
   * @param {string} serviceName - AWS service name.
   * @param {string} stringToSign - The string to be signed.
   * @return {string} The AWS signature as a hex string.
   */
  getSignature(secretKey, date, region, serviceName, stringToSign) {
    const kDate = this.hmac(`AWS4${secretKey}`, date);
    const kRegion = this.hmac(kDate, region);
    const kService = this.hmac(kRegion, serviceName);
    const kSigning = this.hmac(kService, 'aws4_request');
    return crypto
      .createHmac('sha256', kSigning)
      .update(stringToSign)
      .digest('hex');
  }

  /**
   * Constructs the Authorization header for AWS requests, including the AWS signature.
   *
   * @function createAuthorizationHeader
   * @param {string} accessKey - AWS access key.
   * @param {string} date - Current date in YYYYMMDD format.
   * @param {string} region - AWS region name.
   * @param {string} service - AWS service name.
   * @param {string} signature - The AWS signature as a hex string.
   * @return {string} Authorization header value.
   */
  createAuthorizationHeader(accessKey, date, region, service, signature) {
    return [
      `AWS4-HMAC-SHA256 Credential=${accessKey}/${date}/${region}/${service}/aws4_request`,
      'SignedHeaders=accept;host;x-amz-access-token;x-amz-date',
      `Signature=${signature}`,
    ].join(', ');
  }

  /**
   * Performs HMAC-SHA256 hashing on the given message with the provided key.
   *
   * @function hmac
   * @param {(string|Buffer)} key - The key for the HMAC operation.
   * @param {string} message - The message to hash.
   * @return {Buffer} The resulting HMAC-SHA256 hash as a buffer.
   */
  hmac(key, message) {
    return crypto.createHmac('sha256', key).update(message).digest();
  }

  /**
   * Creates headers for the request.
   * @param {string} method - The HTTP method for the request.
   * @param {string} fullUrl - The full URL of the request.
   * @param {string} queryString - Query string parameters.
   * @param {string} accessToken - The LWA access token.
   * @param {string} date - The current date and time in ISO format.
   * @return {Object} The headers for the request.
   */
  createRequestHeaders(method, fullUrl, queryString, accessToken, date) {
    const signature = this.getSignature(
      process.env.AWS_SECRET_KEY,
      date,
      process.env.AWS_REGION,
      'execute-api',
      this.createStringToSign(
        this.createCanonicalRequest(
          method,
          fullUrl,
          queryString,
          '',
          accessToken,
          date,
        ),
        date,
        process.env.AWS_REGION,
        'execute-api',
      ),
    );

    return {
      'Content-Type': 'application/json',
      'User-Agent': 'MyApp/1.0 (Platform=Node.js; Language=JavaScript)',
      'x-amz-access-token': accessToken,
      'x-amz-date': date,
      Host: 'sellingpartnerapi-eu.amazon.com',
      'Accept-Encoding': 'gzip, deflate, br',
      Authorization: this.createAuthorizationHeader(
        process.env.AWS_ACCESS_KEY,
        date,
        process.env.AWS_REGION,
        'execute-api',
        signature,
      ),
    };
  }

  /**
   * @description Sends a request to the Amazon Selling Partner API with dynamic rate limiting.
   * @async
   * @param {string} method - The HTTP method for the request.
   * @param {string} endpoint - The API endpoint for the request.
   * @param {Object} queryParams - Query parameters.
   * @param {Object} body - The request body.
   * @param {string} logContext - The context for logging.
   * @param {boolean} createLog - Whether to log the request and response.
   * @param {boolean} flushBuffer - Whether to flush the log buffer.
   * @param {string} apiOperation - The API operation being performed.
   * @param {boolean} isGrantless - Indicates grantless operation.
   * @param {Object} rateLimitConfig - Configuration for rate limiting { rate: Number, burst: Number }.
   * @return {Promise<Object>} - The API response.
   */
  async sendRequest(
    method,
    endpoint,
    queryParams = {},
    body = {},
    logContext,
    createLog,
    flushBuffer,
    apiOperation,
    isGrantless = false,
    rateLimitConfig = { rate: 1, burst: 5 },
  ) {
    // Retrieve an existing limiter or create a new one with dynamic settings based on rateLimitConfig
    const limiter = this.limiterGroup.key(apiOperation, () => ({
      reservoir: rateLimitConfig.burst,
      reservoirRefreshAmount: rateLimitConfig.burst,
      reservoirRefreshInterval: (1000 / rateLimitConfig.rate) * 1000, // Convert rate to milliseconds
      minTime: (1 / rateLimitConfig.rate) * 1000, // Minimum time between dispatches
    }));

    // Schedule the request through the limiter
    return limiter
      .schedule(() =>
        this._sendRequestWithRetry(
          method,
          endpoint,
          queryParams,
          body,
          logContext,
          createLog,
          flushBuffer,
          apiOperation,
          isGrantless,
          0, // Initial retry count
        ),
      )
      .then(response => {
        return response;
      })
      .catch(error => {
        // Error handling
        const logMessage = `Error scheduling the request: ${error}\n`;
        if (createLog) {
          logger(logMessage, logContext, '', flushBuffer);
        }
        throw error; // Re-throw the error to be handled by the caller
      });
  }

  /**
   * Sends a request to the Amazon Selling Partner API with exponential backoff for rate limiting.
   * @async
   * @param {string} method - HTTP method (GET, POST, etc.).
   * @param {string} endpoint - API endpoint endpoint.
   * @param {Object} [queryParams={}] - Query parameters.
   * @param {Object} [body={}] - Request body for POST/PUT methods.
   * @param {string} logContext - Identifier for the log context.
   * @param {boolean} createLog - Flag to indicate if the request and response should be logged.
   * @param {boolean} flushBuffer - Flag to indicate if the log buffer should be flushed.
   * @param {string} apiOperation - Identifier for the API operation.
   * @param {boolean} [isGrantless=false] - Flag for grantless operations.
   * @param {number} [retryCount=0] - Current retry attempt count.
   * @return {Promise<Object>} Response from the API call.
   */
  async _sendRequestWithRetry(
    method,
    endpoint,
    queryParams,
    body,
    logContext,
    createLog,
    flushBuffer,
    apiOperation,
    isGrantless = false,
    retryCount,
  ) {
    let logMessage = `Sending request to ${apiOperation} API operation with retry attempt ${retryCount}.\n`;
    try {
      const accessToken = isGrantless
        ? await this.getGrantlessOperationToken()
        : await this.getLWAToken();
      const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');

      let queryString = '';
      if (Object.keys(queryParams).length > 0) {
        queryString =
          '?' +
          Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
      }

      const fullUrl = `https://sellingpartnerapi-eu.amazon.com${endpoint}${queryString}`;
      const headers = this.createRequestHeaders(
        method,
        fullUrl,
        queryString,
        accessToken,
        date,
      );

      logMessage +=
        'Request Details:\n' +
        JSON.stringify(
          {
            apiOperation,
            URL: fullUrl,
            Method: method,
            Headers: headers,
            QueryParams: queryParams,
            Body: body,
          },
          null,
          2,
        );

      let axiosResponse;
      if (method === 'GET') {
        axiosResponse = await axios.get(fullUrl, { headers });
      } else {
        axiosResponse = await axios[method.toLowerCase()](fullUrl, body, {
          headers,
        });
      }

      logMessage +=
        '\n\nResponse Details:\n' +
        JSON.stringify(
          {
            Data: axiosResponse.data,
            Status: axiosResponse.status,
            Headers: axiosResponse.headers,
          },
          null,
          2,
        );
      return axiosResponse;
    } catch (error) {
      // Check if the error response has a status of 429 (Too Many Requests)
      if (error.response && error.response.status === 429) {
        let retryAfter = 2000; // Default retry after 2 seconds if no header is found
        if (error.response.headers['retry-after']) {
          retryAfter = parseInt(error.response.headers['retry-after']) * 1000; // Convert to milliseconds if provided in seconds
        }
        if (retryCount < 5) {
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          return this._sendRequestWithRetry(
            method,
            endpoint,
            queryParams,
            body,
            logContext,
            createLog,
            apiOperation,
            isGrantless,
            retryCount + 1,
          );
        }
      } else {
        logMessage += '\n\nError in sendRequest: ' + error.toString();
        if (error.response) {
          logMessage +=
            '\nResponse Error Details:\n' +
            JSON.stringify(
              {
                Data: error.response.data,
                Status: error.response.status,
                Headers: error.response.headers,
              },
              null,
              2,
            );
        } else if (error.request) {
          logMessage +=
            '\nRequest Error Details:\n' +
            JSON.stringify(error.request, null, 2);
        } else {
          logMessage += '\nSetup Error: ' + error.message;
        }
        throw error;
      }
    } finally {
      if (createLog) {
        logger(logMessage, logContext, '', flushBuffer);
      }
    }
  }
}

const spApiInstance = new SpApiConnector(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REFRESH_TOKEN,
);

// Export the instance
module.exports = { spApiInstance };
