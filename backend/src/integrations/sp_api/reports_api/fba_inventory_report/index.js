/* eslint-disable no-unused-vars */
const { getReport } = require('../operations/getReport.js');
const { getReportDocument } = require('../operations/getReportDocument.js');
const {
  fetchAndProcessInventoryReport,
} = require('./fetchAndProcessInventoryReport');
const marketplaces = require('../../../../config/marketplaces');
const {
  downloadAndDecompressDocument,
} = require('../downloadAndDecompressDocument');
const { seedSellingPriceHistory } = require('./seedSellingPricesHistory');
// const ReportsManager = require('../reportsManager');
const { createReport } = require('../operations/createReport.js');

/**
 * Requests an FBA Inventory report from the Amazon Selling Partner API.
 *
 * @async
 * @function requestFbaInventoryReport
 * @param {array} countryKeys - The marketplace identifier for which the report is requested.
 * @param {string} reportType - The type of report being requested.
 * @param {string} startDate - The start date and time for the report data in ISO 8601 format.
 * @param {string} endDate - The end date and time for the report data in ISO 8601 format.
 * @return {Promise<void>} - A promise that resolves when the report request is completed.
 */
async function requestFbaInventoryReport(
  countryKeys,
  reportType,
  startDate,
  endDate,
) {
  const marketplaceIds = countryKeys.map(
    key => marketplaces[key].marketplaceId,
  );
  // Instantiate your reports manager
  // const reportsManager = new ReportsManager();

  const config = {
    marketplaceIds: marketplaceIds,
    reportType: reportType,
    dataStartTime: startDate,
    dataEndTime: endDate,
    createLog: true,
  };

  try {
    // Step 1: Create Report to get ReportId
    const reportIdResponse = await createReport(config);

    console.log('reportIdResponse:', reportIdResponse);

    // Step 2 : Request report document ID
    // const reportDocumentId = await getReport(
    //   reportIdResponse.reportId,
    //   config.createLog,
    //   config.reportType,
    // );

    const reportDocumentId =
      'amzn1.spdoc.1.4.eu.8c39df68-32f0-47f5-98ce-9f7d876de460.TQLD0IKN0DQOV.2651'; // SE
    // 'amzn1.spdoc.1.4.eu.d723f827-9464-4b1b-87af-8ba52eeb02e0.T1CHOST40MSZ9.2651'; // FR

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getReportDocument(
      reportDocumentId,
      config.createLog,
      config.reportType,
    );

    // downloadAndDecompressDocument(
    //   documentUrl,
    //   compressionAlgorithm,
    //   reportType,
    //   countryKeys,
    //   config.dataStartTime,
    //   config.dataEndTime,
    // );

    // Fetch CSV data and process into database
    await fetchAndProcessInventoryReport(
      documentUrl,
      compressionAlgorithm,
      reportDocumentId,
      countryKeys,
      reportType,
    );

    // await seedSellingPriceHistory();
  } catch (error) {
    console.error('Error in requesting FBA Inventory report:', error);
  }
}
requestFbaInventoryReport(
  ['sweden'],
  'GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA',
  null,
  null,
);

module.exports = { requestFbaInventoryReport };
