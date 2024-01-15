const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function getReportSchedule
 * @description Returns report schedule details for the report schedule that you specify.
 * @async
 * @param {Object} config - config to apply when fetching reports.
 * @return {Promise<Object>} - ReportSchedule - Detailed information about a report schedule.
 */
async function getReportSchedule(config) {
  const { reportScheduleId, createLog } = config;
  const queryParams = {
    reportScheduleId,
  };
  const apiOperation = 'getReportSchedule';
  const endpoint = `/reports/2021-06-30/schedules/${reportScheduleId}`;
  const method = 'GET';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      queryParams,
      {},
      createLog,
      apiOperation,
      false,
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { getReportSchedule };

config = {
  reportScheduleId: '50057019737',
  createLog: true,
};
getReportSchedule(config);
