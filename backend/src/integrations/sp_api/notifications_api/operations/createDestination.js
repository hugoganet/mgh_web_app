require('dotenv').config({ path: 'backend/.env' });
const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function createDestination
 * @description Creates a destination in the Selling Partner API for Notifications
 * @param {string} destinationName
 * @param {string} sqsArn
 * @return {Promise}
 */
async function createDestination(destinationName) {
  const endpoint = '/notifications/v1/destinations';
  const method = 'POST';
  const sqsArn = process.env.SQS_ARN;
  const payload = {
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
      {}, // No queryParams for POST
      payload,
      true, // Enable logging
      apiOperation,
      true,
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
const destinationName = 'MGHWebAppNotifications';

createDestination(destinationName)
  .then(data => console.log('Create Destination Response:', data))
  .catch(error => console.error(error));
