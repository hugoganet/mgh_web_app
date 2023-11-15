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
    // const documentUrl =
    //   'https://tortuga-prod-eu.s3-eu-west-1.amazonaws.com/283430aa-718c-457c-9819-c48811e29a6f.amzn1.tortuga.4.eu.TB6YHSW3Q1ZQU?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231115T150120Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=AKIAX2ZVOZFBB4YFXXHU%2F20231115%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Signature=dfacc454f5d621c784bfc9306766824eeec5cf72d4b4869f30280009857538bb';
    // const compressionAlgorithm = null;

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
