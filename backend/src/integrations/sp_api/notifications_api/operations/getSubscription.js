const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Retrieves information about a subscription of a specific notification type.
 * @param {string} notificationType - The type of notification to retrieve information about.
 * @param {string} [payloadVersion] - The version of the payload for the notification (optional).
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @return {Promise<Object>} - Response from the API call.
 */
async function getSubscription(
  notificationType,
  payloadVersion = null,
  createLog = false,
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
      {}, // Empty body for GET request
      createLog,
      apiOperation,
      (isGrantless = false),
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
const notificationType = 'ANY_OFFER_CHANGED';
const payloadVersion = '1.0'; // Optional
getSubscription(notificationType, payloadVersion, true);
