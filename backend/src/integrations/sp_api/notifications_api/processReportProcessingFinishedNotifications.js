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
const { logAndCollect } = require('../logs/logger.js');
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
        const deleteMessage = deleteMessageCommand(message.ReceiptHandle);
        await sqsClient.send(deleteMessage);
      } catch (error) {
        logMessage += `Error deleting ${reportType} notification from queue : ${error}\n`;
      }
    } else if (reportType === 'GET_AFN_INVENTORY_DATA') {
      try {
        const deleteMessage = deleteMessageCommand(message.ReceiptHandle);
        await sqsClient.send(deleteMessage);
        logMessage += `Deleted ${reportType} notification from queue\n`;
      } catch (error) {
        logMessage += `Error deleting ${reportType} notification from queue : ${error}\n`;
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
      logAndCollect(logMessage, apiOperation);
    }
  }
}

module.exports = { processReportProcessingFinishedNotification };
