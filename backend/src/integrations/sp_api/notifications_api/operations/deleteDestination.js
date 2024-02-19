require('dotenv').config({ path: 'backend/.env' });
const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function deleteDestination
 * @description Creates a destination in the Selling Partner API for Notifications
 * @param {string} destinationId - The id of the destination to delete.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise}
 */
async function deleteDestination(
  destinationId,
  createLog = false,
  logContext = 'deleteDestination',
  flushBuffer = false,
) {
  const endpoint = `/notifications/v1/destinations/${destinationId}`;
  const method = 'DELETE';
  const apiOperation = 'deleteDestination';

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
      'Error deleting destination:',
      error.response ? error.response.data : error,
    );
    throw error;
  }
}

module.exports = { deleteDestination };

deleteDestination(
  'f7b4283f-ec83-462a-a999-925dbe6d32c3',
  true,
  'deleteDestination',
  true,
);
