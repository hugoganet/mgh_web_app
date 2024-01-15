const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require('@aws-sdk/client-sqs');
require('dotenv').config({ path: 'backend/.env' });
const {
  getReportDocument,
} = require('../../reports_api/operations/getReportDocument.js');
// const {
//   fetchAndProcessInventoryReport,
// } = require('../../reports_api/fba_inventory_report/fetchAndProcessInventoryReport.js');
// const { getReportSchedules } = require('../../reports_api/operations/getReportSchedules.js');

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
    WaitTimeSeconds: 5, // Long polling
    VisibilityTimeout: 10, // Adjust as needed
    MessageRetentionPeriod: 1209600, // 14 days
  };

  try {
    const receiveCommand = new ReceiveMessageCommand(receiveParams);
    const data = await sqsClient.send(receiveCommand);

    if (data.Messages) {
      for (const message of data.Messages) {
        const notification = JSON.parse(message.Body);

        // console.log(notification);

        // Process the notification based on its type
        if (notification.notificationType === 'REPORT_PROCESSING_FINISHED') {
          console.log('REPORT_PROCESSING_FINISHED');
          console.log(notification);
          console.log('-------------------------------------');

          const reportDocumentId =
            notification.payload.reportProcessingFinishedNotification
              .reportDocumentId;
          const reportType =
            notification.payload.reportProcessingFinishedNotification
              .reportType;

          const { documentUrl, compressionAlgorithm } = await getReportDocument(
            reportDocumentId,
            true,
            reportType,
          );

          // TODO Get countryKeys before calling fetchAndProcessInventoryReport
          // const countryKeys = ['sweden'];
          // // Fetch CSV data and process into database
          // await fetchAndProcessInventoryReport(
          //   documentUrl,
          //   compressionAlgorithm,
          //   reportDocumentId,
          //   countryKeys,
          //   reportType,
          // );
        }

        // Add logic for other notification types as needed

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
