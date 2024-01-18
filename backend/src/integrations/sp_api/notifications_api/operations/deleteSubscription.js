const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Deletes a subscription for a specific notification type and subscription ID.
 * @param {string} notificationType - The type of notification.
 * @param {string} subscriptionId - The identifier for the subscription to delete.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @return {Promise<Object>} - Response from the API call.
 */
async function deleteSubscriptionById(
  notificationType,
  subscriptionId,
  createLog = false,
) {
  const apiOperation = 'deleteSubscriptionById';
  const endpoint = `/notifications/v1/subscriptions/${notificationType}/${subscriptionId}`;
  const method = 'DELETE';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      {}, // Empty queryParams for DELETE request
      {}, // Empty body for DELETE request
      createLog,
      apiOperation,
      true,
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
const notificationType = 'ANY_OFFER_CHANGED';
const subscriptionId = 'fb7fb667-38c2-41ee-b9d2-77b80b9039ce';
deleteSubscriptionById(notificationType, subscriptionId, true);
