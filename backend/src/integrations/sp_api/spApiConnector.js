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
}

/**
 * Connects to the Amazon Selling Partner (SP) API using the provided credentials.
 * It fetches the Login with Amazon (LWA) token and can be extended to perform
 * further operations with the SP API.
 *
 * @async
 * @function connectToSpApi
 * @return {Promise<void>} A promise that resolves when the connection process is complete.
 */
async function connectToSpApi() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const refreshToken = process.env.REFRESH_TOKEN;

  const spApi = new SpApiConnector(clientId, clientSecret, refreshToken);

  try {
    await spApi.getLWAToken();
  } catch (error) {
    console.error('Error connecting to SP API:', error);
  }
}
connectToSpApi();
module.exports = { connectToSpApi };
