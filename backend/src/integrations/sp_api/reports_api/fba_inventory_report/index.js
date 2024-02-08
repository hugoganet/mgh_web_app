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
const { createReport } = require('../operations/createReport.js');
const { logger } = require('../../../../utils/logger');

/**
 * Requests an FBA Inventory report from the Amazon Selling Partner API.
 *
 * @async
 * @function requestFbaInventoryReport
 * @param {array} country - The marketplace identifier for which the report is requested.
 * @param {string} reportType - The type of report being requested.
 * @param {string} logContext - The type of report being requested.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} dataStartTime - The start date and time for the report data in ISO 8601 format.
 * @param {string} dataEndTime - The end date and time for the report data in ISO 8601 format.
 * @return {Promise<void>} - A promise that resolves when the report request is completed.
 */
async function requestFbaInventoryReport(
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
    // // Step 1: Create Report to get ReportId
    // const reportIdResponse = await createReport(
    //   marketplaceIds,
    //   reportType,
    //   logContext,
    //   createLog,
    //   dataStartTime,
    //   dataEndTime,
    // );

    // // Waiting for 2 minutes (120000 milliseconds) before proceeding to the next step
    // await new Promise(resolve => setTimeout(resolve, 60000 * 2));

    // // Step 2 : Request report document ID
    // const reportDocumentId = await getReport(
    //   reportIdResponse.reportId,
    //   createLog,
    //   logContext,
    // );

    const reportDocumentId =
      //   //   // 'amzn1.spdoc.1.4.eu.f7b75d40-725b-48c2-bdf1-25c1d170fe1a.T1TJXQMEOP6F78.2651'; // PL
      //   //   // 'amzn1.spdoc.1.4.eu.fe1e84d2-982c-489a-800f-32f400dae70e.TE9Q2KN2IWU7W.2651'; // UK
      //   //   // 'amzn1.spdoc.1.4.eu.b2a04f6a-4f6b-4e5e-aeee-4358f249e382.TMJISGFM4QT0U.2651'; // FR
      //   //   //  'amzn1.spdoc.1.4.eu.2b27c303-d7c0-41c9-abf9-6e62b656e19f.TY1M93LGOOVTG.2651'; // FR
      'amzn1.spdoc.1.4.eu.fdec64a7-9aca-47e6-ba71-e2a332486488.T2TGT18L2RTN5.2651'; // SE
    // // // // 'amzn1.spdoc.1.4.eu.676049ac-e8f9-482a-844b-cbbe8e669026.T23JVIUV5OOZBA.2651'; // BE
    // // // 'amzn1.spdoc.1.4.eu.9cb48e16-ccb9-404f-8b8f-7eee1fdb49a0.T3297N0K75JAE1.2651'; // NL
    // // 'amzn1.spdoc.1.4.eu.b3576b9a-3942-4672-8516-f94fb3a3c426.T2M2KT4WLMZ2CG.2651'; // ES
    // // 'amzn1.spdoc.1.4.eu.8da8812e-4d6d-4c31-8582-9ebbef234d33.T3SOIONY47K9JT.2651'; // IT
    // // 'amzn1.spdoc.1.4.eu.baf3f61b-1f3a-44d3-9304-85fea6bd0a89.T1SOV0NF16MRRD.2651'; // DE
    // // 'amzn1.spdoc.1.4.eu.8363b830-ce6b-4f0e-81e7-5f28dbcfd5e1.T2LBHOKZ77F7Y6.2651'; // TR

    // Request report document URL
    const { documentUrl, compressionAlgorithm } = await getReportDocument(
      reportDocumentId,
      createLog,
      logContext,
    );

    // downloadAndDecompressDocument(
    //   documentUrl,
    //   compressionAlgorithm,
    //   reportType,
    //   countryCode,
    //   dataStartTime,
    //   dataEndTime,
    // );

    // Fetch CSV data and process into database
    await fetchAndProcessInventoryReport(
      documentUrl,
      compressionAlgorithm,
      reportDocumentId,
      country,
      createLog,
      logContext,
    );

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

module.exports = { requestFbaInventoryReport };

requestFbaInventoryReport(
  (country = ['sweden']),
  (reportType = 'GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA'),
  (logContext = 'create_fetch_and_process_inventory_report'),
  (createLog = true),
  (dataStartTime = null),
  (dataEndTime = null),
);
