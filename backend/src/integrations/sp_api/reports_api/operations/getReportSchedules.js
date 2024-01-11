const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function getReportSchedules
 * @description Create reports based on the specified config.
 * @async
 * @param {Object} config - config to apply when fetching reports.
 * @return {Promise<Object>} - reportId
 */
async function getReportSchedules(config) {
  const endpoint = '/reports/2021-06-30/schedules';
  const method = 'GET';
  const { reportType, createLog } = config;
  const apiOperation = 'getReportSchedules';
  const queryParams = {
    reportTypes: [reportType], // Ensure this is an array of string(s)
  };

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      queryParams,
      {},
      createLog,
      apiOperation,
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { getReportSchedules };

config = {
  reportType: ['GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA'],
  createLog: true,
};
getReportSchedules(config);
