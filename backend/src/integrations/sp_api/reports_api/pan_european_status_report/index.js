/* eslint-disable no-unused-vars */
const { getReport } = require('../operations/getReport.js');
const { getReportDocument } = require('../operations/getReportDocument.js');
const marketplaces = require('../../../../utils/marketplaces.js');
const {
  downloadAndDecompressDocument,
} = require('../../../../utils/downloadAndDecompressDocument.js');
const { createReport } = require('../operations/createReport.js');
const { logger } = require('../../../../utils/logger');

/**
 * Requests an FBA Inventory report from the Amazon Selling Partner API.
 *
 * @async
 * @function requestPanEuropeanReport
 * @param {array} country - The marketplace identifier for which the report is requested.
 * @param {string} reportType - The type of report being requested.
 * @param {string} logContext - The type of report being requested.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} dataStartTime - The start date and time for the report data in ISO 8601 format.
 * @param {string} dataEndTime - The end date and time for the report data in ISO 8601 format.
 * @return {Promise<void>} - A promise that resolves when the report request is completed.
 */
async function requestPanEuropeanReport(
  country,
  reportType,
  logContext,
  createLog,
  dataStartTime,
  dataEndTime,
) {
  const marketplaceIds = country.map(key => marketplaces[key].marketplaceId);
  const countryCode = country.map(key => marketplaces[key].countryCode);
  let logMessage = '';
  try {
    // Step 1: Create Report to get ReportId
    const reportIdResponse = await createReport(
      marketplaceIds,
      reportType,
      logContext,
      createLog,
      dataStartTime,
      dataEndTime,
    );

    // Waiting for 2 minutes (120000 milliseconds) before proceeding to the next step
    await new Promise(resolve => setTimeout(resolve, 60000 * 2));

    // Step 2 : Request report document ID
    const response = await getReport(
      reportIdResponse.reportId,
      createLog,
      logContext,
    );
    const reportDocumentId = response.reportDocumentId;

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getReportDocument(
      reportDocumentId,
      createLog,
      logContext,
    );

    downloadAndDecompressDocument(
      documentUrl,
      compressionAlgorithm,
      reportType,
      countryCode,
      dataStartTime,
      dataEndTime,
    );

    // // Fetch CSV data and process into database
    // await fetchAndProcessInventoryReport(
    //   documentUrl,
    //   compressionAlgorithm,
    //   reportDocumentId,
    //   country,
    //   createLog,
    //   logContext,
    // );

    logMessage += `Finished fetching and processing inventory report for ${country} in index.js\n`;
  } catch (error) {
    console.error('Overall error in requesting FBA Inventory report:', error);
    logMessage += `Overral error in requesting FBA Inventory report: ${error}\n`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { requestPanEuropeanReport };

requestPanEuropeanReport(
  (country = ['france']),
  (reportType = 'GET_PAN_EU_OFFER_STATUS'),
  (logContext = 'create_fetch_and_process_pan_european_report'),
  (createLog = true),
  (dataStartTime = null),
  (dataEndTime = null),
);
