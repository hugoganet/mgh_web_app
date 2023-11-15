const { getReportId } = require('./getReportId');
const { getReportDocumentId } = require('./getReportDocumentId');
const { getDocumentUrl } = require('./getDocumentUrl');
const {
  downloadAndDecompressDocument,
} = require('./downloadAndDecompressDocument');
const { fetchAndProcessCSV } = require('./fecthAndProcessCsv');
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
    // // Request report ID
    // const reportIdResponse = await getReportId(config);

    // // Request report document ID
    // const reportDocumentId = await getReportDocumentId(
    //   reportIdResponse.reportId,
    //   config.createLog,
    //   config.reportType,
    // );

    const reportDocumentId =
      'amzn1.spdoc.1.4.eu.2fbf55b1-0a14-4cef-85ae-8143f274e5e4.TYLM8LGX9K0WH.2651';

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getDocumentUrl(
      reportDocumentId,
      config.createLog,
      config.reportType,
    );

    // Fetch CSV data and process into database
    await fetchAndProcessCSV(
      documentUrl,
      compressionAlgorithm,
      reportDocumentId,
    );

    //   await downloadAndDecompressDocument(
    //     documentUrl,
    //     compressionAlgorithm,
    //     config.reportType,
    //     markeplaces.france.countryCode,
    //     config.dataStartTime,
    //     config.dataEndTime,
    //   );
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
