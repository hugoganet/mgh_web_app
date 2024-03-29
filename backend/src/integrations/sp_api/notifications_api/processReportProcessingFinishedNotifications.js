const {
  getReportDocument,
} = require('../reports_api/operations/getReportDocument.js');
const {
  fetchAndProcessInventoryReport,
} = require('../reports_api/fba_inventory_report/fetchAndProcessInventoryReport.js');
const { getReport } = require('../reports_api/operations/getReport.js');
const {
  getCountryNameFromMarketplaceId,
} = require('../../../utils/getCountryNameFromMarketplaceId.js');
const { logger } = require('../../../utils/logger');
const {
  deleteMessageCommand,
} = require('./aws_sqs_queue/deleteMessageCommand.js');
const { sqsClient } = require('./aws_sqs_queue/sqsClient.js');

/**
 * Processes a "REPORT_PROCESSING_FINISHED" type notification.
 * @param {Object} message - The SQS message.
 * @param {function} createLog - The logger function.
 * @return {Promise<void>}
 */
async function processReportProcessingFinishedNotification(
  message,
  createLog = true,
) {
  const apiOperation = 'ReceiveAndProcessNotifications';
  let logMessage = '';
  const notification = JSON.parse(message.Body);
  const payload = notification.payload;
  try {
    const reportDocumentId =
      payload.reportProcessingFinishedNotification.reportDocumentId;
    const reportType = payload.reportProcessingFinishedNotification.reportType;
    const reportId = payload.reportProcessingFinishedNotification.reportId;
    const notificationId = notification.notificationMetadata.notificationId;

    if (reportType === 'GET_FBA_MYI_ALL_INVENTORY_DATA') {
      logMessage += `Received ${reportType} notification : ${JSON.stringify(
        notification,
        null,
        2,
      )}\n`;

      let response;
      let documentDetails;
      try {
        response = await getReport(reportId, true, reportType);
        documentDetails = await getReportDocument(
          reportDocumentId,
          true,
          reportType,
        );
      } catch (reportError) {
        console.error('Error processing report:', reportError);
        logMessage += `Error processing report: ${reportError}\n`;
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
          reportType,
          true,
        );
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
    } else if (reportType === 'GET_AFN_INVENTORY_DATA') {
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
        logMessage += `Error deleting ${notificationId} notification of type ${reportType} from queue : ${error} DeleteMessageCommand response: ${JSON.stringify(
          deleteResponse,
          null,
          2,
        )}\n`;
      }
    }
  } catch (error) {
    console.log(
      'Overall error in processReportProcessingFinishedNotification:',
      error,
    );
    logMessage += `Overall error in processReportProcessingFinishedNotification: ${error}\n`;
  } finally {
    if (createLog) {
      logger(logMessage, apiOperation);
    }
  }
}

module.exports = { processReportProcessingFinishedNotification };
