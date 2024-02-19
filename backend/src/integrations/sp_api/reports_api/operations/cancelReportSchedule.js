const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function cancelReportSchedule
 * @description Returns report schedule details for the report schedule that you specify.
 * @async
 * @param {string} reportScheduleId - The identifier for the report schedule.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @return {Promise<Object>} - ReportSchedule - Detailed information about a report schedule.
 */
async function cancelReportSchedule(
  reportScheduleId,
  createLog = false,
  logContext = 'cancelReportSchedule',
) {
  const apiOperation = 'cancelReportSchedule';
  const endpoint = `/reports/2021-06-30/schedules/${reportScheduleId}`;
  const method = 'DELETE';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      (queryParams = {}),
      (body = {}),
      logContext,
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
