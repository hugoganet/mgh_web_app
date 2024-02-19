const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function getReportSchedules
 * @description Create reports based on the specified config.
 * @async
 * @param {string} reportType - The type of report being scheduled.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise<Object>} - reportId
 */
async function getReportSchedules(
  reportType,
  createLog = false,
  logContext = 'getReportSchedules',
  flushBuffer = false,
) {
  const queryParams = {
    reportTypes: [reportType], // Ensure this is an array of string(s)
  };
  const apiOperation = 'getReportSchedules';
  const endpoint = '/reports/2021-06-30/schedules';
  const method = 'GET';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      queryParams,
      (body = {}),
      logContext,
      createLog,
      flushBuffer,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 0.0222, burst: 10 }),
    );

    const reportSchedules = response.data.reportSchedules;
    for (const reportSchedule of reportSchedules) {
      console.log(reportSchedule);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { getReportSchedules };

// config = {
//   reportType: ['GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA'],
//   createLog: true,
// };
// getReportSchedules(config);
