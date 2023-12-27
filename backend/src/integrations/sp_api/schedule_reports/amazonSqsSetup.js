require('dotenv').config({ path: 'backend/.env' });
const { spApiInstance } = require('../spApiConnector');
// const logAndCollect = require('./reports_api/logs/logAndCollect');

/**
 * @function createDestination
 * @description STEP 1 : Creates a destination in the SP API Notifications API.
 * @param {string} sqsArn
 * @return {Promise<string>} - A promise that resolves to the destination ID.
 */
async function createDestination(sqsArn) {
  const path = '/notifications/v1/destinations';
  const payload = {
    name: 'MySPAPIDestination',
    resourceSpecification: {
      sqs: { arn: sqsArn },
    },
  };

  try {
    const response = await spApiInstance.sendRequest(
      'POST',
      path,
      {},
      payload,
      true,
    );
    return response.data.destinationId;
  } catch (error) {
    console.error('Error creating destination:', error);
    throw error;
  }
}

/**
 * @function createSubscription
 * @description STEP 2 : Creates a subscription in the SP API Notifications API.
 * @param {string} destinationId
 * @param {string} notificationType // REPORT_PROCESSING_FINISHED
 * @return {Promise<string>} - A promise that resolves to the subscription ID.
 */
async function createSubscription(destinationId, notificationType) {
  const path = `/notifications/v1/subscriptions/${notificationType}`;
  const payload = {
    payloadVersion: '1.0',
    destinationId,
  };

  try {
    const response = await spApiInstance.sendRequest(
      'POST',
      path,
      {},
      payload,
      true,
    );
    return response.data.subscriptionId;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

module.exports = { createDestination, createSubscription };
