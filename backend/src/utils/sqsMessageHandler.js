const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' }); // Update as per your region
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueURL = process.env.SQS_QUEUE_URL;

/**
 * @function pollQueueForMessages
 * @description Polls the SQS queue for messages and processes them.
 * @return {Promise<void>}
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#receiveMessage-property}
 */
async function pollQueueForMessages() {
  const params = {
    QueueUrl: queueURL,
    MaxNumberOfMessages: 10, // Adjust as needed
    WaitTimeSeconds: 20, // Long polling
  };

  try {
    const data = await sqs.receiveMessage(params).promise();
    if (data.Messages) {
      for (const message of data.Messages) {
        // Process each message
        await processMessage(message);
      }
    }
  } catch (error) {
    console.error(`Error polling queue: ${error}`);
  }
}

/**
 * @function processMessage
 * @description Processes a message received from the SQS queue.
 * @param {string} message
 * @return {Promise<void>}
 */
async function processMessage(message) {
  // Extract and process message details
  // ...

  // Delete message from queue after processing
  await deleteMessageFromQueue(message.ReceiptHandle);
}

/**
 * @function deleteMessageFromQueue
 * @description Deletes a message from the SQS queue.
 * @async
 * @param {string} receiptHandle
 * @return {Promise<void>}
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#deleteMessage-property}
 */
async function deleteMessageFromQueue(receiptHandle) {
  const deleteParams = {
    QueueUrl: queueURL,
    ReceiptHandle: receiptHandle,
  };

  try {
    await sqs.deleteMessage(deleteParams).promise();
  } catch (error) {
    console.error(`Error deleting message: ${error}`);
  }
}

// Export the pollQueue function to be used in your application
module.exports = { pollQueueForMessages };
