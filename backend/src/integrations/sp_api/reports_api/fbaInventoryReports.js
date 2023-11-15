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
 * @param {array} marketplaceIds - The marketplace identifier for which the report is requested.
 * @param {string} reportType - The type of report being requested.
 * @param {string} startDate - The start date and time for the report data in ISO 8601 format.
 * @param {string} endDate - The end date and time for the report data in ISO 8601 format.
 * @return {Promise<void>} - A promise that resolves when the report request is completed.
 */
async function requestFbaInventoryReport(
  marketplaceIds,
  reportType,
  startDate,
  endDate,
) {
  const config = {
    marketplaceIds: marketplaceIds,
    reportType: reportType,
    dataStartTime: startDate,
    dataEndTime: endDate,
    createLog: true,
  };

  try {
    // Request report ID
    const reportIdResponse = await getReportId(config);

    // Request report document ID
    const reportDocumentId = await getReportDocumentId(
      reportIdResponse.reportId,
      config.createLog,
    );

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getDocumentUrl(
      reportDocumentId,
      config.createLog,
    );

    await downloadAndDecompressDocument(
      documentUrl,
      compressionAlgorithm,
      config.reportType,
      markeplaces.france.countryCode,
      config.dataStartTime,
      config.dataEndTime,
      config.createLog,
    );
  } catch (error) {
    console.error('Error in requesting FBA Inventory report:', error);
  }
}
requestFbaInventoryReport(
  [
    markeplaces.france.marketplaceId,
    markeplaces.belgium.marketplaceId,
    markeplaces.germany.marketplaceId,
  ],
  'GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA',
  null,
  null,
);

module.exports = { requestFbaInventoryReport };
