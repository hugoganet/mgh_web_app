require('dotenv').config({ path: 'backend/.env' });
const { logAndCollect } = require('../../logs/logger');

const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require('@aws-sdk/client-sqs');

const {
  getReportDocument,
} = require('../../reports_api/operations/getReportDocument.js');

const {
  fetchAndProcessInventoryReport,
} = require('../../reports_api/fba_inventory_report/fetchAndProcessInventoryReport.js');

const { getReport } = require('../../reports_api/operations/getReport.js');

const {
  getCountryNameFromMarketplaceId,
} = require('../../../../utils/getCountryNameFromMarketplaceId.js');

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
 * @param {function} createLog - The logger function
 * @description Receives and processes notifications from the SQS queue
 * @return {Promise}
 */
async function receiveAndProcessNotifications(createLog = false) {
  const receiveParams = {
    QueueUrl: queueURL,
    MaxNumberOfMessages: 10, // Adjust as needed
    WaitTimeSeconds: 5, // Long polling
    VisibilityTimeout: 10, // Adjust as needed
    MessageRetentionPeriod: 1209600, // 14 days
  };
  const apiOperation = 'ReceiveAndProcessNotifications';
  let logMessage = '';

  try {
    const receiveCommand = new ReceiveMessageCommand(receiveParams);
    const data = await sqsClient.send(receiveCommand);

    if (data.Messages) {
      for (const message of data.Messages) {
        try {
          const notification = JSON.parse(message.Body);

          // Process the notification based on its type
          if (notification.notificationType === 'REPORT_PROCESSING_FINISHED') {
            logMessage += `Received notification 'REPORT_PROCESSING_FINISHED' : ${JSON.stringify(
              notification,
              null,
              2,
            )}\n`;

            const reportDocumentId =
              notification.payload.reportProcessingFinishedNotification
                .reportDocumentId;
            const reportType =
              notification.payload.reportProcessingFinishedNotification
                .reportType;
            const reportId =
              notification.payload.reportProcessingFinishedNotification
                .reportId;
            const response = await getReport(reportId, true, reportType);
            const { documentUrl, compressionAlgorithm } =
              await getReportDocument(reportDocumentId, true, reportType);
            const countryKeys = getCountryNameFromMarketplaceId(
              response.marketplaceIds[0],
            );
            logMessage += `Compression algorithm: ${compressionAlgorithm}
          Document URL: ${documentUrl}
          Country keys: ${countryKeys}/n`;

            // Fetch CSV data and process into database
            await fetchAndProcessInventoryReport(
              documentUrl,
              compressionAlgorithm,
              reportDocumentId,
              [countryKeys],
              reportType,
            );
          }

          // Delete the message from the queue after processing

          // const deleteParams = {
          //   QueueUrl: queueURL,
          //   ReceiptHandle: message.ReceiptHandle,
          // };
          // const deleteCommand = new DeleteMessageCommand(deleteParams);
          // await sqsClient.send(deleteCommand);
        } catch (error) {
          console.error('Error processing notification:', error);
          logMessage += `Error processing notification: ${error}\n`;
        }
      }
    } else {
      logMessage += 'No messages received.\n';
    }
    if (createLog) {
      logAndCollect(logMessage, apiOperation);
    }
  } catch (error) {
    console.error('Error processing notifications:', error);
    logMessage += `Error processing notifications: ${error}\n`;
    if (createLog) {
      logAndCollect(logMessage, apiOperation);
    }
  }
}

receiveAndProcessNotifications(true);
