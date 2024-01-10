const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function getReportSchedules
 * @description Create reports based on the specified config.
 * @async
 * @param {Object} config - config to apply when fetching reports.
 * @return {Promise<Object>} - reportId
 */
async function getReportSchedules(config) {
  const endpoint = '/reports/2021-06-30/schedule';
  const method = 'GET';
  const { reportType, createLog } = config;
  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      {},
      {
        reportType,
      },
      createLog,
      reportType,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { getReportSchedules };

getReportSchedules('GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA', false);
