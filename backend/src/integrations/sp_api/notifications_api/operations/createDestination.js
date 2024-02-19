require('dotenv').config({ path: 'backend/.env' });
const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function createDestination
 * @description Creates a destination in the Selling Partner API for Notifications
 * @param {string} destinationName - The name of the destination to create.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise}
 */
async function createDestination(
  destinationName,
  createLog = false,
  logContext = 'createDestination',
  flushBuffer = false,
) {
  const endpoint = '/notifications/v1/destinations';
  const method = 'POST';
  const sqsArn = process.env.SQS_ARN;
  const body = {
    name: destinationName,
    resourceSpecification: {
      sqs: {
        arn: sqsArn,
      },
    },
  };
  const apiOperation = 'createDestination';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      (queryParams = {}),
      body,
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

module.exports = { createDestination };

// Example usage
const destinationName = 'MGHWebAppNotificationsTest';

createDestination(destinationName, true);
