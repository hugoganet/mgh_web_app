const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Deletes a subscription for a specific notification type and subscription ID.
 * @param {string} notificationType - The type of notification.
 * @param {string} subscriptionId - The identifier for the subscription to delete.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @return {Promise<Object>} - Response from the API call.
 */
async function deleteSubscriptionById(
  notificationType,
  subscriptionId,
  createLog = false,
  logContext = 'deleteSubscriptionById',
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
const subscriptionId = '7fb53ffd-6d7c-40bb-87bb-82d32f4c714a';
deleteSubscriptionById(notificationType, subscriptionId, true);
