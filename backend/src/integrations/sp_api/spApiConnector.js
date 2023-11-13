require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

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
    const url = 'https://api.amazon.com/auth/o2/token';
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };

    try {
      const response = await axios.post(url, payload);
      console.log('LWA Token fetched successfully.');
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching LWA Token:', error);
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
   * @return {Promise<Object>} - A promise that resolves to the response from the API call.
   * @description This function handles the construction and sending of requests to the Amazon Selling Partner API.
   *              It handles the generation of the canonical request, signing the request, and setting the appropriate headers.
   */
  async sendRequest(method, path, queryParams = {}, body = {}) {
    const accessToken = await this.getLWAToken();
    const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const canonicalRequest = this.createCanonicalRequest(
      method,
      'https://sellingpartnerapi-eu.amazon.com',
      path,
      queryString,
      '',
      accessToken,
      date,
    );
    // console.log(`canonicalRequest => ${canonicalRequest} -----------------`);

    const stringToSign = this.createStringToSign(
      canonicalRequest,
      date,
      'eu-west-1',
      'execute-api',
    );
    // console.log(`stringToSign => ${stringToSign} -----------------`);

    const signature = this.getSignature(
      process.env.AWS_SECRET_KEY,
      date,
      'eu-west-1',
      'execute-api',
      stringToSign,
    );
    console.log(`signature => ${signature} -----------------`);

    const authHeader = this.createAuthorizationHeader(
      process.env.AWS_ACCESS_KEY,
      date,
      'eu-west-1',
      'execute-api',
      signature,
    );
    console.log(`authHeader => ${authHeader} -----------------`);

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'MyApp/1.0 (Platform=Node.js; Language=JavaScript)',
      'x-amz-access-token': accessToken,
      'x-amz-date': date,
      Authorization: authHeader,
    };

    const endpoint = `https://sellingpartnerapi-eu.amazon.com${path}`;
    if (method === 'GET') {
      return axios.get(`${endpoint}?${queryString}`, { headers });
    } else {
      return axios[method.toLowerCase()](endpoint, body, { headers });
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
