/* eslint-disable no-unused-vars */
const {
  getReportDocument,
} = require('../reports_api/operations/getReportDocument.js');
const {
  fetchAndProcessInventoryReport,
} = require('../reports_api/fba_inventory_report/fetchAndProcessInventoryReport.js');
const { getReport } = require('../reports_api/operations/getReport.js');
const {
  convertMarketplaceIdentifier,
} = require('../../../utils/convertMarketplaceIdentifier');
const { logger } = require('../../../utils/logger');
const {
  deleteMessageCommand,
} = require('./aws_sqs_queue/deleteMessageCommand.js');
const { sqsClient } = require('./aws_sqs_queue/sqsClient.js');

/**
 * @description Processes a "REPORT_PROCESSING_FINISHED" type notification.
 * @async
 * @function processReportProcessingFinishedNotification
 * @param {Object} message - The SQS message.
 * @param {function} createLog - The logger function.
 * @param {string} logContext - The context for the log.
 * @return {Promise<void>}
 */
async function processReportProcessingFinishedNotification(
  message,
  createLog = true,
  logContext = 'processReportProcessingFinishedNotification',
) {
  let logMessage = '';
  const notification = JSON.parse(message.Body);
  const payload = notification.payload;
  const reportDocumentId =
    payload.reportProcessingFinishedNotification.reportDocumentId;
  const reportType = payload.reportProcessingFinishedNotification.reportType;
  const reportId = payload.reportProcessingFinishedNotification.reportId;
  const notificationId = notification.notificationMetadata.notificationId;
  try {
    if (reportType === 'GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA') {
      logMessage += `Received ${reportType} notification : ${JSON.stringify(
        notification,
        null,
        2,
      )}\n`;

      const response = await getReport(reportId, false, logContext);
      logMessage += `Retrieved report details for reportId ${reportId} : ${JSON.stringify(
        response,
        null,
        2,
      )}\n`;

      const documentDetails = await getReportDocument(
        reportDocumentId,
        true,
        logContext,
      );
      // const countryKeys = convertMarketplaceIdentifier(
      //   response.marketplaceIds[0],
      //   true,
      //   logContext,
      // );

      try {
        // await fetchAndProcessInventoryReport(
        //   documentDetails.documentUrl,
        //   documentDetails.compressionAlgorithm,
        //   reportDocumentId,
        //   [countryKeys.countryName],
        //   true,
        //   logContext,
        // );
      } catch (processError) {
        console.error('Error processing inventory report:', processError);
        logMessage += `Error processing inventory report: ${processError}\n`;
      }
      try {
        logMessage += `Deleting message with ReceiptHandle ${message.ReceiptHandle}\n`;
        const deleteMessage = deleteMessageCommand(
          message.ReceiptHandle,
          false,
        );
        const deleteResponse = await sqsClient.send(deleteMessage);
        logMessage += `Deleted ${notificationId} notification of type ${reportType} from queue\n DeleteMessageCommand response: ${JSON.stringify(
          deleteResponse,
          null,
          2,
        )}\n`;
      } catch (error) {
        logMessage += `Error deleting ${notificationId} notification of type ${reportType} from queue : ${error}\n DeleteMessageCommand response: ${JSON.stringify(
          deleteResponse,
          null,
          2,
        )}\n`;
      }
    } else {
      let deleteResponse;
      try {
        console.log('Unknown report type:', reportType);
        logMessage += `Unknown report type: ${reportType}\n`;

        logMessage += `Deleting message with ReceiptHandle ${message.ReceiptHandle}\n`;
        const deleteMessage = deleteMessageCommand(
          message.ReceiptHandle,
          false,
        );
        deleteResponse = await sqsClient.send(deleteMessage);
        logMessage += `Deleted ${notificationId} notification of type ${reportType} from queue\n`;
      } catch (error) {
        logMessage += `Error deleting ${notificationId} notification of type ${reportType} from queue : ${error} DeleteMessageCommand response: ${JSON.stringify(
          deleteResponse,
          null,
          2,
        )}\n`;
      }
    }
  } catch (error) {
    console.log('Overall error in processReportProcessingFinishedNotification');
    logMessage += `Overall error in processReportProcessingFinishedNotification: ${error}\n`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { processReportProcessingFinishedNotification };
