/* eslint-disable no-unused-vars */
const { createReport } = require('../operations/createReport');
const { getReport } = require('../operations/getReport');
const { getReportDocument } = require('../operations/getReportDocument');
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
    // // Request report ID
    // const reportIdResponse = await createReport(config);

    // // Waiting for 2 minutes (120000 milliseconds) before proceeding to the next step
    // await new Promise(resolve => setTimeout(resolve, 60000 * 2));

    // // Request report document ID
    //  const response = await getReport(
    //     reportIdResponse.reportId,
    //     createLog,
    //     logContext,
    //   );
    //   const reportDocumentId = response.reportDocumentId;

    const reportDocumentId =
      //   'amzn1.spdoc.1.4.eu.16c2a3bb-7246-484e-9fc7-b45e64bb3958.T198MMEP8AX7GM.2511';
      'amzn1.spdoc.1.4.eu.34ae866d-96fc-4a6c-bc48-15e9f890db00.T9FOQTE3NV954.2511';

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getReportDocument(
      reportDocumentId,
      config.createLog,
      config.reportType,
    );

    downloadAndDecompressDocument(
      documentUrl,
      compressionAlgorithm,
      reportType,
      countryKeys,
      config.dataStartTime,
      config.dataEndTime,
    );

    // Fetch CSV data and process into database
    await fetchAndProcessSalesReport(
      documentUrl,
      compressionAlgorithm,
      reportDocumentId,
      reportType,
      config.createLog,
    );
  } catch (error) {
    console.error('Error in requesting FBA sales report:', error);
  }
}
requestFbaSalesReport(
  ['france'], // this doesn't matter, the report is for all marketplaces
  'GET_AMAZON_FULFILLED_SHIPMENTS_DATA_GENERAL',
  '2023-12-01',
  '2023-12-31',
);

module.exports = { requestFbaSalesReport };
