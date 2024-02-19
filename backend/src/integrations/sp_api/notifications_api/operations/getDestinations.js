require('dotenv').config({ path: 'backend/.env' });
const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function getDestinations
 * @description Retrieves information about destinations in the Selling Partner API for Notifications.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise}
 */
async function getDestinations(
  createLog = false,
  logContext = 'getDestinations',
  flushBuffer = false,
) {
  const endpoint = '/notifications/v1/destinations';
  const method = 'GET';
  const apiOperation = 'getDestinations';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      (queryParams = {}),
      (body = {}),
      logContext,
      createLog,
      apiOperation,
      flushBuffer,
      (isGrantless = true),
      (rateLimitConfig = { rate: 1, burst: 5 }),
    );

    return response.data;
  } catch (error) {
    console.error(
      'Error creating destination:',
      error.response ? error.response.data : error,
    );
    throw error;
  }
}

module.exports = { getDestinations };

getDestinations(true, 'getDestinations', true);
