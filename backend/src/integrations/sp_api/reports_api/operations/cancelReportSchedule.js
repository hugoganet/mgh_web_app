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
  const queryParams = {
    reportScheduleId,
  };
  const apiOperation = 'cancelReportSchedule';
  const endpoint = `/reports/2021-06-30/schedules/${reportScheduleId}`;
  const method = 'DELETE';

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

module.exports = { cancelReportSchedule };

config = {
  reportScheduleId: '50040019733',
  createLog: true,
};
cancelReportSchedule(config);
