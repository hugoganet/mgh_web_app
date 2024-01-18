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
  const apiOperation = 'ReceiveAndProcessNotifications';
  let logMessage = '';
  let data;
  try {
    try {
      const receiveCommand = new ReceiveMessageCommand({
        QueueUrl: queueURL,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 10,
        MessageRetentionPeriod: 1209600,
      });
      data = await sqsClient.send(receiveCommand);
    } catch (error) {
      console.error('Error receiving SQS messages:', error);
      logMessage += `Error receiving SQS messages: ${error}\n`;
      return; // Exit the function early if unable to receive messages
    }

    if (data.Messages && data.Messages.length > 0) {
      for (const message of data.Messages) {
        try {
          const notification = JSON.parse(message.Body);
          const notificationType =
            notification.notificationType || notification.NotificationType;

          if (notificationType === 'REPORT_PROCESSING_FINISHED') {
            logMessage += `Received ${notificationType} notification : ${JSON.stringify(
              notification,
              null,
              2,
            )}\n`;

            let response;
            let documentDetails;
            try {
              const reportDocumentId =
                notification.payload.reportProcessingFinishedNotification
                  .reportDocumentId;
              const reportType =
                notification.payload.reportProcessingFinishedNotification
                  .reportType;
              const reportId =
                notification.payload.reportProcessingFinishedNotification
                  .reportId;

              response = await getReport(reportId, true, reportType);
              console.log(response);
              documentDetails = await getReportDocument(
                reportDocumentId,
                true,
                reportType,
              );
            } catch (reportError) {
              console.error('Error processing report:', reportError);
              logMessage += `Error processing report: ${reportError}\n`;
              continue; // Move to the next notification
            }

            const countryKeys = getCountryNameFromMarketplaceId(
              response.marketplaceIds[0],
            );
            logMessage += `Processing report for country: ${countryKeys}\n`;

            try {
              await fetchAndProcessInventoryReport(
                documentDetails.documentUrl,
                documentDetails.compressionAlgorithm,
                documentDetails.reportDocumentId,
                [countryKeys],
                documentDetails.reportType,
                true,
              );
            } catch (processError) {
              console.error('Error processing inventory report:', processError);
              logMessage += `Error processing inventory report: ${processError}\n`;
            }
          }

          if (notificationType === 'ANY_OFFER_CHANGED') {
            const deleteParams = {
              QueueUrl: queueURL,
              ReceiptHandle: message.ReceiptHandle,
            };
            await sqsClient.send(new DeleteMessageCommand(deleteParams));
          }
        } catch (parseError) {
          console.error('Error parsing SQS message:', parseError);
          logMessage += `Error parsing SQS message: ${parseError}\n`;
        }
      }
    } else {
      logMessage += 'No SQS messages received.\n';
    }
  } catch (error) {
    console.error('Error receiving and processing notifications:', error);
    logMessage += `Error receiving and processing notifications: ${error}\n`;
    if (createLog) {
      logAndCollect(logMessage, apiOperation);
    }
  } finally {
    if (createLog) {
      logAndCollect(logMessage, apiOperation);
    }
  }
}

receiveAndProcessNotifications(true);
