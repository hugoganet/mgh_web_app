const { spApiInstance } = require('../spApiConnector');

/**
 * Retrieves report details from the Amazon Selling Partner API.
 *
 * @async
 * @function getReports
 * @param {Object} config - Configuration parameters for the report retrieval.
 * @param {array} config.reportTypes - A list of report types used to filter reports.
 * @param {array} config.processingStatuses - A list of processing statuses used to filter reports.
 * @param {array} config.marketplaceIds - A list of marketplace identifiers used to filter reports.
 * @param {number} [config.pageSize=10] - The maximum number of reports to return in a single call.
 * @param {string} config.createdSince - The earliest report creation date and time in ISO 8601 format.
 * @param {string} [config.createdUntil] - The latest report creation date and time in ISO 8601 format.
 * @param {string} [config.nextToken] - A string token returned in the response to the previous request.
 * @return {Promise<Object>} - A promise that resolves to the report details.
 */
async function getReports(config) {
  const {
    reportTypes,
    processingStatuses,
    marketplaceIds,
    pageSize = 10,
    createdSince,
    createdUntil,
    nextToken,
  } = config;

  const path = '/reports/2021-06-30/reports';

  try {
    const response = await spApiInstance.sendRequest('GET', path, {
      reportTypes,
      processingStatuses,
      marketplaceIds,
      pageSize,
      createdSince,
      createdUntil,
      nextToken,
    });

    return response.data;
  } catch (error) {
    console.error(error.response.data.errors);
  }
}
getReports({});

module.exports = { getReports };
