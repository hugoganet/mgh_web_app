const { spApiInstance } = require('../spApiConnector');

/**
 * Requests a report from the Amazon Selling Partner API and returns the report ID.
 *
 * @async
 * @function getReportId
 * @param {Object} config - Configuration parameters for the report request.
 * @param {string} config.marketplaceId - The marketplace identifier for which the report is requested.
 * @param {string} config.reportType - The type of report being requested.
 * @param {string} config.dataStartTime - The start time for the data range of the report.
 * @param {string} config.dataEndTime - The end time for the data range of the report.
 * @param {string} [config.region='eu-west-1'] - AWS region for the request.
 * @param {string} [config.path='/reports/2021-06-30/reports'] - API path for the report request.
 * @param {string} [config.endpoint='https://sellingpartnerapi-eu.amazon.com'] - Endpoint URL for the API.
 * @return {Promise<string>} - A promise that resolves to the report ID.
 */
async function getReportId(config) {
  const { marketplaceId, reportType, dataStartTime, dataEndTime } = config;
  const path = '/reports/2021-06-30/reports';

  try {
    const response = await spApiInstance.sendRequest(
      'POST',
      path,
      {},
      {
        reportType,
        marketplaceIds: [marketplaceId],
        dataStartTime,
        dataEndTime,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error.response);
  }
}

module.exports = { getReportId };
