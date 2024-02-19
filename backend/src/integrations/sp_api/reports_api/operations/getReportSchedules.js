const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function getReportSchedules
 * @description This function gets the scheduled reports for the seller.
 * @async
 * @param {string} reportType - The type of report to get schedules for.
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
    reportTypes: [reportType],
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

getReportSchedules(
  ['GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA'],
  true,
  'getReportSchedules',
  true,
);
