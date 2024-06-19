const { getReports } = require('../getReports');
const { getDocumentUrl } = require('../getDocumentUrl');
const { fetchAndProcessCsv } = require('./fecthAndProcessCsv');
const marketplaces = require('../../../../utils/marketplaces.js');

/**
 * Requests a settlement report from the Amazon Selling Partner API and processes the data.
 *
 * @async
 * @function requestSettlementReport
 * @param {array} countryKeys - The marketplace identifier for which the report is requested.
 * @param {string} reportType - The type of report being requested.
 * @return {Promise<void>} - A promise that resolves when the report request is completed.
 */
async function requestSettlementReport(countryKeys, reportType) {
  const marketplaceIds = countryKeys.map(
    key => marketplaces[key].marketplaceId,
  );

  const config = {
    marketplaceIds: marketplaceIds,
    reportTypes: [reportType],
    pageSize: 1,
    createLog: true,
  };

  try {
    // Request settlement report
    const reportsResponse = await getReports(config);

    // Check if the settlement report is available
    const settlementReport = reportsResponse.reports.find(
      report =>
        report.reportType === reportType && report.processingStatus === 'DONE',
    );

    if (settlementReport) {
      const { documentUrl, compressionAlgorithm } = await getDocumentUrl(
        settlementReport.reportDocumentId,
        config.createLog,
        reportType,
      );

      // Fetch CSV data and process into database
      await fetchAndProcessCsv(
        documentUrl,
        compressionAlgorithm,
        settlementReport.reportDocumentId,
        countryKeys,
        reportType,
      );
    } else {
      console.log(`Settlement report ${reportType} is not available yet.`);
    }
  } catch (error) {
    console.error(
      `Error in requesting settlement report ${reportType}:`,
      error,
    );
  }
}

// Example usage
requestSettlementReport(
  ['france'],
  'GET_V2_SETTLEMENT_REPORT_DATA_FLAT_FILE_V2',
);

module.exports = { requestSettlementReport };
