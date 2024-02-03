const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function cancelReportSchedule
 * @description Returns report schedule details for the report schedule that you specify.
 * @async
 * @param {Object} config - config to apply when fetching reports.
 * @return {Promise<Object>} - ReportSchedule - Detailed information about a report schedule.
 */
async function cancelReportSchedule(config) {
  const { reportScheduleId, createLog } = config;
  const apiOperation = 'cancelReportSchedule';
  const endpoint = `/reports/2021-06-30/schedules/${reportScheduleId}`;
  const method = 'DELETE';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      {},
      {},
      createLog,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 0.0222, burst: 10 }),
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { cancelReportSchedule };

config = {
  reportScheduleId: '50062019737',
  createLog: true,
};
cancelReportSchedule(config);
