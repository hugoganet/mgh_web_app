/* eslint-disable no-unused-vars */
const { getReportId } = require('../getReportId');
const { getReportDocumentId } = require('../getReportDocumentId');
const { getDocumentUrl } = require('../getDocumentUrl');
const {
  fetchAndProcessInventoryReport,
} = require('./fetchAndProcessInventoryReport');
const marketplaces = require('../../../../config/marketplaces');
const {
  downloadAndDecompressDocument,
} = require('../downloadAndDecompressDocument');

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
      'amzn1.spdoc.1.4.eu.0f9e82d9-228b-4100-be74-9ab6b130efc2.T3UYJ0G28GMMO3.2651'; // BE
    // 'amzn1.spdoc.1.4.eu.f1869d8e-0cc2-4f37-ac61-145dfeb94996.T1STUU7A5ISUK2.2651'; // FR

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getDocumentUrl(
      reportDocumentId,
      config.createLog,
      config.reportType,
    );

    /* downloadAndDecompressDocument(
      documentUrl,
      compressionAlgorithm,
      reportType,
      countryKeys,
      config.dataStartTime,
      config.dataEndTime,
    ); */

    // Fetch CSV data and process into database
    await fetchAndProcessInventoryReport(
      documentUrl,
      compressionAlgorithm,
      reportDocumentId,
      countryKeys,
      reportType,
    );
  } catch (error) {
    console.error('Error in requesting FBA Inventory report:', error);
  }
}
requestFbaInventoryReport(
  ['belgium'],
  'GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA',
  null,
  null,
);

module.exports = { requestFbaInventoryReport };
