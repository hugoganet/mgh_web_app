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
const {
  seedSellingPriceHistory,
} = require('../../../../api/services/seedSellingPricesHistory');

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
    // Request report ID
    const reportIdResponse = await getReportId(config);

    // Request report document ID
    const reportDocumentId = await getReportDocumentId(
      reportIdResponse.reportId,
      config.createLog,
      config.reportType,
    );

    // const reportDocumentId =
    //     'amzn1.spdoc.1.4.eu.a2ae7f18-4f0b-4f17-8f46-98a9a915840f.TRHOX6I8AVL9M.2651'; // DE
    //   'amzn1.spdoc.1.4.eu.3017b172-affc-453c-9675-9a3b66a69834.T1Z0MPL5LXOQTT.2651'; // SE
    // 'amzn1.spdoc.1.4.eu.9ed4dc89-edc8-4c0b-bc7b-6a03d06b096a.T16SFO17SP8LHA.2651'; // FR
    // 'amzn1.spdoc.1.4.eu.4a226136-e5bb-44ff-9fe4-fa0ae1dde7be.T11LMVTFHAIXHG.2651'; // SE
    // 'amzn1.spdoc.1.4.eu.0f9e82d9-228b-4100-be74-9ab6b130efc2.T3UYJ0G28GMMO3.2651'; // BE

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getDocumentUrl(
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
  ['belgium'],
  'GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA',
  null,
  null,
);

module.exports = { requestFbaInventoryReport };
