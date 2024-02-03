const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function createReport
 * @description Create reports based on the specified filters.
 * @async
 * @param {Object} filters - Filters to apply when fetching reports.
 * @return {Promise<Object>} - reportId
 */
async function createReport(filters) {
  const {
    marketplaceIds = [],
    reportType,
    dataStartTime,
    dataEndTime,
    createLog,
  } = filters;

  const apiOperation = 'createReport';
  const endpoint = '/reports/2021-06-30/reports';
  const method = 'POST';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      {},
      {
        reportType,
        marketplaceIds: marketplaceIds,
        dataStartTime,
        dataEndTime,
      },
      createLog,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 0.0167, burst: 15 }),
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { createReport };
