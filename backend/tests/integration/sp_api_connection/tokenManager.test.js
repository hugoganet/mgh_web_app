const TokenManager = require('../../../src/integrations/sp_api/connection/tokenManager.js');
const axios = require('axios');

// Mocking the axios module so no real HTTP requests are made
jest.mock('axios');

describe('TokenManager', () => {
  // Set up some dummy client ID, client secret, and refresh token
  const clientId = 'testClientId';
  const clientSecret = 'testClientSecret';
  const refreshToken = 'testRefreshToken';

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  it('should fetch a new token when none is cached', async () => {
    // Creating a new instance of TokenManager for testing
    const tokenManager = new TokenManager(clientId, clientSecret, refreshToken);

    // Mock token value to simulate what we would expect from the API
    const mockToken = 'newToken';

    // Mocking the behavior of axios.post to resolve with our mock token
    // This simulates the API call without actually making an HTTP request
    axios.post.mockResolvedValue({ data: { access_token: mockToken } });

    // Calling the method we want to test, which should use the mocked axios.post
    const token = await tokenManager.getLWAToken();

    // Assertions to ensure the method behaves as expected
    expect(token).toBe(mockToken); // Check that the received token is the mock token
    expect(axios.post).toHaveBeenCalledTimes(1); // axios.post should have been called exactly once
  });

  it('should use cached token if it is still valid', async () => {
    // Creating a new instance of TokenManager for testing
    const tokenManager = new TokenManager(clientId, clientSecret, refreshToken);

    // Manually setting a "cached" token and its expiration time for testing
    tokenManager.accessToken = 'cachedToken';
    tokenManager.tokenExpiration = new Date(new Date().getTime() + 10000); // 10 seconds in the future

    // Calling the method we want to test, which should now use the cached token
    const token = await tokenManager.getLWAToken();

    // Assertions to ensure the method behaves as expected
    expect(token).toBe('cachedToken'); // Check that the received token is the cached token
    expect(axios.post).toHaveBeenCalledTimes(0); // axios.post should not have been called since the token is cached
  });

  // You can add more test cases here to cover different scenarios like token expiration, API errors, etc.
});
