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
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise<Object>} - Response from the API call.
 */
async function createSubscription(
  config,
  createLog = false,
  logContext = 'createSubscription',
  flushBuffer = false,
) {
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
      flushBuffer,
      apiOperation,
      (isGrantless = false),
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

const config = {
  notificationType: 'REPORT_PROCESSING_FINISHED',
  payloadVersion: null,
  destinationId: '490f7538-13f7-4958-9b53-1ee89f0fc0cf',
};
createSubscription(config, true, 'createSubscription', true);
