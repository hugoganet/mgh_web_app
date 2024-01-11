const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require('@aws-sdk/client-sqs');
// const { defaultProvider } = require('@aws-sdk/credential-provider-node');
require('dotenv').config({ path: 'backend/.env' });

// Initialize SQS client with the AWS region and credentials
const sqsClient = new SQSClient({
  region: process.env.AWS_region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const queueURL = process.env.SQS_QUEUE_URL;

/**
 * @async
 * @function receiveAndProcessNotifications
 * @description Receives and processes notifications from the SQS queue
 * @return {Promise}
 */
async function receiveAndProcessNotifications() {
  const receiveParams = {
    QueueUrl: queueURL,
    MaxNumberOfMessages: 10, // Adjust as needed
    WaitTimeSeconds: 20, // Long polling
  };

  try {
    const receiveCommand = new ReceiveMessageCommand(receiveParams);
    const data = await sqsClient.send(receiveCommand);

    if (data.Messages) {
      for (const message of data.Messages) {
        const notification = JSON.parse(message.Body);

        // Process the notification based on its type
        if (notification.notificationType === 'REPORT_PROCESSING_FINISHED') {
          // Implement your logic for this notification type
          console.log('Report Processing Finished Notification:', notification);
        }

        // Add logic for other notification types as needed

        // Delete the processed message from the queue
        const deleteParams = {
          QueueUrl: queueURL,
          ReceiptHandle: message.ReceiptHandle,
        };
        const deleteCommand = new DeleteMessageCommand(deleteParams);
        await sqsClient.send(deleteCommand);
      }
    }
  } catch (error) {
    console.error('Error processing notifications:', error);
  }
}

receiveAndProcessNotifications();
