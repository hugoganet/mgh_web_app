const axios = require('axios');

/**
 * @class TokenManager
 * @typedef {Object} TokenManager
 * @property {string} clientId - The LWA client ID.
 * @property {string} clientSecret - The LWA client secret.
 * @property {string} refreshToken - The LWA refresh token.
 * @property {string} accessToken - The LWA access token.
 * @property {Date} tokenExpiration - The date/time when the access token expires.
 * @description Handles the lifecycle of the LWA token including fetching, refreshing, and validating the token's expiry.
 */
class TokenManager {
  // eslint-disable-next-line require-jsdoc
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.tokenExpiration = null;
  }

  /**
   * @method getLWAToken
   * @description Fetches a new LWA token if the current one is invalid or expired.
   * @async
   * @return {Promise<string>} The LWA access token.
   */
  async getLWAToken() {
    if (this.accessToken && new Date() < this.tokenExpiration) {
      console.log('Using cached LWA Token');
      return this.accessToken; // Return cached token if it's still valid
    }

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
      console.log('LWA Token:', this.accessToken);
      return this.accessToken;
    } catch (error) {
      console.error('Error fetching LWA Token:', error);
      throw error;
    }
  }
}

module.exports = TokenManager;
