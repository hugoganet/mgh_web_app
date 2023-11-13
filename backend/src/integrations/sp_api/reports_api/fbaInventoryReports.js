const { getReportId } = require('./getReportId');
const { getReportDocumentId } = require('./getReportDocumentId');
const { getDocumentUrl } = require('./getDocumentUrl');
const {
  downloadAndDecompressDocument,
} = require('./downloadAndDecompressDocument');
const markeplaces = require('../../../../src/config/marketplaces');

/**
 * Requests an FBA Inventory report from the Amazon Selling Partner API.
 *
 * @async
 * @function requestFbaInventoryReport
 * @param {string} marketplaceId - The marketplace identifier for which the report is requested.
 * @param {string} startDate - The start date and time for the report data in ISO 8601 format.
 * @param {string} endDate - The end date and time for the report data in ISO 8601 format.
 * @return {Promise<void>} - A promise that resolves when the report request is completed.
 */
async function requestFbaInventoryReport(marketplaceId, startDate, endDate) {
  const config = {
    marketplaceId: marketplaceId,
    reportType: 'GET_AFN_INVENTORY_DATA_BY_COUNTRY',
    dataStartTime: startDate,
    dataEndTime: endDate,
  };

  try {
    // // Request report ID
    // const reportIdResponse = await getReportId(config);
    // console.log(`reportIdResponse.reportId => ${reportIdResponse.reportId}`);
    // // Request report document ID
    // getReportDocumentId(reportIdResponse.reportId);
    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getDocumentUrl(
      'amzn1.spdoc.1.4.eu.cda350bf-18e1-4e6c-bc92-942df88d9b54.T3KTK4DJJSGG8G.2100',
    );

    await downloadAndDecompressDocument(
      documentUrl,
      compressionAlgorithm,
      config.reportType,
      markeplaces.france.countryCode,
      config.dataStartTime,
      config.dataEndTime,
    );
  } catch (error) {
    console.error('Error in requesting FBA Inventory report:', error);
  }
}
requestFbaInventoryReport(markeplaces.france.marketplaceId, null, null);

module.exports = { requestFbaInventoryReport };
