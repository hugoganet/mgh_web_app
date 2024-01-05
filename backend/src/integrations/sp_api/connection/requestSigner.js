const crypto = require('crypto');

/**
 * @class RequestSigner
 * @description Signs requests for the Amazon Selling Partner API.
 */
class RequestSigner {
  // eslint-disable-next-line require-jsdoc
  constructor(accessKeyId, secretAccessKey, region, service) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
    this.service = service;
  }

  /**
   * Signs a request with AWS Signature Version 4.
   * @param {string} method - HTTP method.
   * @param {string} uri - URI of the request.
   * @param {Object} queryParams - Query parameters.
   * @param {Object} headers - Headers of the request.
   * @param {Object|string} body - Body of the request.
   * @param {string} accessToken - Access token for the request.
   * @return {Object} - Headers including the Authorization header.
   */
  signRequest(method, uri, queryParams, headers, body, accessToken) {
    const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const payloadHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(body))
      .digest('hex');
    const canonicalRequest = this.createCanonicalRequest(
      method,
      uri,
      queryParams,
      headers,
      payloadHash,
    );
    const stringToSign = this.createStringToSign(canonicalRequest, date);
    const signature = this.getSignature(stringToSign, date);

    // Constructing the authorization header
    const credentialScope = `${date.substr(0, 8)}/${this.region}/${
      this.service
    }/aws4_request`;
    const signedHeaders = this.getSignedHeaders(headers);
    const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    // Return all headers including the Authorization header
    return {
      ...headers,
      Authorization: authorizationHeader,
      'x-amz-date': date,
      'x-amz-access-token': accessToken,
      'x-amz-security-token': signature,
    };
  }

  /**
   * Creates a canonical request string for AWS signature version 4 signing process.
   * @param {string} method - HTTP method (GET, POST, etc.).
   * @param {string} uri - Request URI.
   * @param {string} queryString - Query string parameters.
   * @param {string} headers - Request headers.
   * @param {string} payload - Request payload.
   * @return {string} Canonical request string.
   */
  createCanonicalRequest(method, uri, queryString, headers, payload) {
    const hashedPayload = crypto
      .createHash('sha256')
      .update(payload)
      .digest('hex');
    return [
      method,
      uri,
      queryString,
      headers,
      '', // Signed headers list, typically involves host and content-type for SP API, but can vary based on the service.
      hashedPayload,
    ].join('\n');
  }

  /**
   * Creates a string to be signed as part of AWS signature version 4 process.
   * @param {string} canonicalRequest - The canonical request string.
   * @param {string} date - Current date in YYYYMMDD'T'HHMMSS'Z' format.
   * @param {string} region - AWS region code (e.g., "us-west-1").
   * @param {string} service - The AWS service being accessed.
   * @return {string} String to be signed.
   */
  createStringToSign(canonicalRequest, date, region, service) {
    const credentialScope = `${date.substr(
      0,
      8,
    )}/${region}/${service}/aws4_request`;
    const hashedCanonicalRequest = crypto
      .createHash('sha256')
      .update(canonicalRequest)
      .digest('hex');
    return `AWS4-HMAC-SHA256\n${date}\n${credentialScope}\n${hashedCanonicalRequest}`;
  }

  /**
   * Calculates the AWS signature for the provided string to sign using the key derivation function.
   * @param {string} secretKey - AWS secret access key.
   * @param {string} date - Current date in YYYYMMDD format.
   * @param {string} region - AWS region name.
   * @param {string} serviceName - AWS service name.
   * @param {string} stringToSign - The string to be signed.
   * @return {string} The AWS signature as a hex string.
   */
  getSignature(secretKey, date, region, serviceName, stringToSign) {
    const kDate = this.hmac(`AWS4${secretKey}`, date.substr(0, 8));
    const kRegion = this.hmac(kDate, region);
    const kService = this.hmac(kRegion, serviceName);
    const kSigning = this.hmac(kService, 'aws4_request');
    return this.hmac(kSigning, stringToSign, 'hex');
  }

  /**
   * Helper function for HMAC-SHA256 hashing.
   * @param {(string|Buffer)} key - The key for the HMAC operation.
   * @param {string} data - The data to hash.
   * @param {string} [encoding=''] - Encoding of the returned value. If 'hex', returns a hex string.
   * @return {(Buffer|string)} The resulting HMAC-SHA256 hash as a buffer or string based on encoding.
   */
  hmac(key, data, encoding = '') {
    return crypto.createHmac('sha256', key).update(data).digest(encoding);
  }
}

module.exports = RequestSigner;
