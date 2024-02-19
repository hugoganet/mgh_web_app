const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Retrieves information about a subscription of a specific notification type.
 * @param {string} notificationType - The type of notification to retrieve information about.
 * @param {string} [payloadVersion] - The version of the payload for the notification (optional).
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise<Object>} - Response from the API call.
 */
async function getSubscription(
  notificationType,
  payloadVersion = null,
  createLog = false,
  logContext = 'getSubscription',
  flushBuffer = false,
) {
  const apiOperation = 'getSubscription';
  const endpoint = `/notifications/v1/subscriptions/${notificationType}`;
  const method = 'GET';
  const queryParams = payloadVersion ? { payloadVersion } : {};

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      queryParams,
      (body = {}),
      logContext,
      createLog,
      flushBuffer,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 1, burst: 5 }),
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getSubscription:', error);
    throw error;
  }
}

module.exports = { getSubscription };

// Example usage
const notificationType = 'REPORT_PROCESSING_FINISHED';
const payloadVersion = null;
getSubscription(
  notificationType,
  payloadVersion,
  true,
  'getSubscription',
  true,
);
