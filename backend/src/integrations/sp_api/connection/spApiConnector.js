require('dotenv').config({ path: 'backend/.env' });
const axios = require('axios');
const crypto = require('crypto');
const { logAndCollect } = require('../logs/logger');

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
   * Sends a request to the Amazon Selling Partner API with the specified method, path, and parameters.
   *
   * @async
   * @function sendRequest
   * @param {string} method - The HTTP method for the request (e.g., 'GET', 'POST').
   * @param {string} path - The API path for the request.
   * @param {Object} [queryParams={}] - Query parameters to be appended to the URL.
   * @param {Object} [body={}] - The request body, relevant for POST and PUT methods.
   * @param {boolean} createLog - Whether to create a log of the request and response.
   * @param {string} apiOperation - The type of report being requested.
   * @param {boolean} isGrantless - Whether the request is for a grantless operation.
   * @return {Promise<Object>} - A promise that resolves to the response from the API call, or an error object if the request fails.
   * @throws {Error} - An error object if the request fails.
   * @description This function handles the construction and sending of requests to the Amazon Selling Partner API.
   *              It handles the generation of the canonical request, signing the request, and setting the appropriate headers.
   */
  async sendRequest(
    method,
    path,
    queryParams = {},
    body = {},
    createLog,
    apiOperation,
    isGrantless = false,
  ) {
    let logMessage = '';
    try {
      const accessToken = isGrantless
        ? await this.getGrantlessOperationToken()
        : await this.getLWAToken();
      const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');

      // Only create queryString if there are query parameters
      let queryString = '';
      if (Object.keys(queryParams).length > 0) {
        queryString = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
        queryString = '?' + queryString; // Prepend '?' to the queryString
      }

      const fullUrl = `https://sellingpartnerapi-eu.amazon.com${path}${queryString}`;
      const headers = this.createRequestHeaders(
        method,
        fullUrl,
        queryString,
        accessToken,
        date,
      );
      console.log(apiOperation);
      // Prepare log message for the request
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

      // Append log message with response details
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

      if (createLog) {
        logAndCollect(logMessage, apiOperation);
      }

      return axiosResponse;
    } catch (error) {
      // Append log message with error details
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
          '\nRequest Error Details:\n' + JSON.stringify(error.request, null, 2);
      } else {
        logMessage += '\nSetup Error: ' + error.message;
      }

      if (createLog) {
        logAndCollect(logMessage, apiOperation);
      }

      throw error;
    }
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
      Authorization: this.createAuthorizationHeader(
        process.env.AWS_ACCESS_KEY,
        date,
        process.env.AWS_REGION,
        'execute-api',
        signature,
      ),
    };
  }
}

const spApiInstance = new SpApiConnector(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REFRESH_TOKEN,
);

// Export the instance
module.exports = { spApiInstance };
