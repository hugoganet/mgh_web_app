const { getReportId } = require('../getReportId');
const { getReportDocumentId } = require('../getReportDocumentId');
const { getDocumentUrl } = require('../getDocumentUrl');
const { fetchAndProcessSalesReport } = require('./fetchAndProcessSalesReport');
const {
  downloadAndDecompressDocument,
} = require('../downloadAndDecompressDocument');
const marketplaces = require('../../../../config/marketplaces');

/**
 * Requests an FBA Inventory report from the Amazon Selling Partner API.
 *
 * @async
 * @function requestFbaSalesReport
 * @param {array} countryKeys - The marketplace identifier for which the report is requested.
 * @param {string} reportType - The type of report being requested.
 * @param {string} startDate - The start date and time for the report data in ISO 8601 format.
 * @param {string} endDate - The end date and time for the report data in ISO 8601 format.
 * @return {Promise<void>} - A promise that resolves when the report request is completed.
 */
async function requestFbaSalesReport(
  countryKeys,
  reportType,
  startDate,
  endDate,
) {
  const marketplaceIds = countryKeys.map(
    key => marketplaces[key].marketplaceId,
  );

  const config = {
    marketplaceIds: marketplaceIds,
    reportType: reportType,
    dataStartTime: startDate,
    dataEndTime: endDate,
    createLog: true,
  };

  try {
    /*   // Request report ID
    const reportIdResponse = await getReportId(config);

    // Request report document ID
    const reportDocumentId = await getReportDocumentId(
      reportIdResponse.reportId,
      config.createLog,
      config.reportType,
    ); */

    const reportDocumentId =
      'amzn1.spdoc.1.4.eu.d13319d3-08f1-4258-91a1-1012a2b9b910.T6SL13GP8HJUL.2511';

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getDocumentUrl(
      reportDocumentId,
      config.createLog,
      config.reportType,
    );

    /*   downloadAndDecompressDocument(
      documentUrl,
      compressionAlgorithm,
      reportType,
      countryKeys,
      config.dataStartTime,
      config.dataEndTime,
      outputPath,
    );
 */
    // Fetch CSV data and process into database
    await fetchAndProcessSalesReport(
      documentUrl,
      compressionAlgorithm,
      reportDocumentId,
      reportType,
    );
  } catch (error) {
    console.error('Error in requesting FBA Inventory report:', error);
  }
}
requestFbaSalesReport(
  ['france'],
  'GET_AMAZON_FULFILLED_SHIPMENTS_DATA_GENERAL',
  '2023-09-15',
  '2023-10-15',
);

module.exports = { requestFbaSalesReport };
