const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Deletes a subscription for a specific notification type and subscription ID.
 * @param {string} notificationType - The type of notification.
 * @param {string} subscriptionId - The identifier for the subscription to delete.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise<Object>} - Response from the API call.
 */
async function deleteSubscriptionById(
  notificationType,
  subscriptionId,
  createLog = false,
  logContext = 'deleteSubscriptionById',
  flushBuffer = false,
) {
  const apiOperation = 'deleteSubscriptionById';
  const endpoint = `/notifications/v1/subscriptions/${notificationType}/${subscriptionId}`;
  const method = 'DELETE';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      (queryParams = {}),
      (body = {}),
      logContext,
      createLog,
      flushBuffer,
      apiOperation,
      (isGrantless = true),
      (rateLimitConfig = { rate: 1, burst: 5 }),
    );

    console.log('Subscription deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in deleteSubscriptionById:', error);
    throw error;
  }
}

module.exports = { deleteSubscriptionById };

// Example usage
const notificationType = 'REPORT_PROCESSING_FINISHED';
const subscriptionId = '633f70aa-495c-463a-b21b-60d85a676719';
deleteSubscriptionById(
  notificationType,
  subscriptionId,
  true,
  'deleteSubscriptionById',
  true,
);
