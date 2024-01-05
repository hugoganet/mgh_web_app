const axios = require('axios');
const ApiRequestor = require('../../../src/integrations/sp_api/connection/apiRequestor');
const TokenManager = require('../../../src/integrations/sp_api/connection/tokenManager');
const RequestSigner = require('../../../src/integrations/sp_api/connection/requestSigner');

// Mock axios and other modules used in ApiRequestor
jest.mock('axios');
jest.mock('../../../src/integrations/sp_api/connection/tokenManager');
jest.mock('../../../src/integrations/sp_api/connection/requestSigner');

describe('ApiRequestor', () => {
  let apiRequestor;
  const baseUrl = 'https://fakeapi.example.com';

  beforeEach(() => {
    // Set up ApiRequestor with mocked dependencies
    apiRequestor = new ApiRequestor(baseUrl);
    // Mock the getLWAToken method to return a fixed token
    TokenManager.prototype.getLWAToken.mockResolvedValue('mockAccessToken');
    // Mock the signRequest method to return a fixed set of headers
    RequestSigner.prototype.signRequest.mockReturnValue({
      'User-Agent': 'MyApp/1.0 (Language=Node.js)',
      'x-amz-access-token': 'mockAccessToken',
      'x-amz-date': 'mockDate',
      Authorization: 'mockAuthorizationHeader',
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mock function calls and results
  });

  it('should send a request with correct configuration', async () => {
    // Define the request details
    const endpoint = '/testEndpoint';
    const method = 'GET';
    const queryParams = { key: 'value' };
    const body = { data: 'test' };

    // Mock the axios call to resolve with a fake response
    axios.mockResolvedValue({ data: 'response' });

    // Make the API request using the ApiRequestor
    const response = await apiRequestor.sendRequest(
      method,
      endpoint,
      queryParams,
      body,
    );

    // Check that the response matches the mocked response
    expect(response).toBe('response');
    // Ensure axios was called with the correct configuration, including method, URL, params, headers, and body
    expect(axios).toHaveBeenCalledWith({
      method: method,
      url: baseUrl + endpoint,
      params: queryParams,
      headers: expect.anything(), // We're expecting signed headers to be included here
      data: body,
    });
  });

  // Add more tests as needed to cover other methods (POST, PUT, etc.), error handling, and various edge cases
});
