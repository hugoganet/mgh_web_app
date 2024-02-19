// const axios = require('axios');
const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Creates a subscription to a specific notification type on the Amazon Selling Partner API.
 * @param {Object} config - Configuration for creating the subscription.
 * @param {string} config.notificationType - The type of notification to subscribe to.
 * @param {string} config.payloadVersion - The version of the payload for the notification.
 * @param {string} config.destinationId - The ID of the destination where notifications will be delivered.
 * @param {Object} [config.processingDirective] - Additional information for processing notifications.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @return {Promise<Object>} - Response from the API call.
 */
async function createSubscription(config, createLog = false, logContext = 'createSubscription') {
  const {
    notificationType,
    payloadVersion,
    destinationId,
    processingDirective,
  } = config;

  const apiOperation = 'createSubscription';
  const endpoint = `/notifications/v1/subscriptions/${notificationType}`;
  const method = 'POST';
  const body = {
    payloadVersion,
    destinationId,
    ...(processingDirective && { processingDirective }),
  };

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      (queryParams = {}),
      body,
      logContext,
      createLog,
      apiOperation,
      (isGrantless = true),
      (rateLimitConfig = { rate: 1, burst: 5 }),
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createSubscription:', error);
    throw error;
  }
}

module.exports = { createSubscription };

// Example usage
const config = {
  notificationType: 'REPORT_PROCESSING_FINISHED',
  payloadVersion: '1.0',
  destinationId: 'f7b4283f-ec83-462a-a999-925dbe6d32c3',
};
createSubscription(config, true);
