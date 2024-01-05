const axios = require('axios');
const TokenManager = require('./tokenManager');
const RequestSigner = require('./requestSigner');

/**
 * Handles creating and sending requests to the Amazon Selling Partner API.
 */
class ApiRequestor {
  /**
   * Initializes the API Requestor with necessary configurations.
   * @param {string} baseUrl - The base URL for the SP API.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.tokenManager = new TokenManager(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REFRESH_TOKEN,
    );
    this.requestSigner = new RequestSigner(
      process.env.AWS_ACCESS_KEY,
      process.env.AWS_SECRET_KEY,
      process.env.AWS_REGION,
      'execute-api', // Service name
    );
  }

  /**
   * Sends a request to the specified endpoint with given parameters and body.
   * @async
   * @param {string} method - The HTTP method for the request.
   * @param {string} endpoint - The path of the API endpoint.
   * @param {Object} [queryParams={}] - The query parameters for the request.
   * @param {Object} [body={}] - The body of the request.
   * @return {Promise<Object>} The response from the API.
   */
  async sendRequest(method, endpoint, queryParams = {}, body = {}) {
    const accessToken = await this.tokenManager.getLWAToken(); // Retrieve the access token.
    const url = this.baseUrl + endpoint;
    const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');

    // Prepare the headers for the request including signed headers from RequestSigner.
    const headers = {
      'User-Agent': 'MyApp/1.0 (Language=Node.js)',
      'x-amz-access-token': accessToken,
      'x-amz-date': date,
      ...this.requestSigner.signRequest(method, url, queryParams, body),
    };

    try {
      // Make the API request using axios.
      const response = await axios({
        method: method,
        url: url,
        params: queryParams,
        headers: headers,
        data: body,
      });
      return response.data; // Return the response data from the API.
    } catch (error) {
      console.error('Error sending request to SP API:', error);
      throw error;
    }
  }
}

module.exports = ApiRequestor;
