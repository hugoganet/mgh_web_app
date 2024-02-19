/* eslint-disable valid-jsdoc */
const { spApiInstance } = require('../../connection/spApiConnector');
const { logger } = require('../../../../utils/logger');

/**
 * @function createReport
 * @description Create reports based on the specified config.
 * @async
 * @param marketplaceIds - The marketplace identifier for which the report is requested.
 * @param dataStartTime - The start date and time for the report data in ISO 8601 format.
 * @param dataEndTime - The end date and time for the report data in ISO 8601 format.
 * @param createLog - Whether to create a log of the process.
 * @param logContext - The type of report being requested.
 * @param flushBuffer - Whether to flush the log buffer.
 * @return {Promise<Object>} - reportId
 */
async function createReport(
  marketplaceIds = [],
  reportType,
  dataStartTime,
  dataEndTime,
  createLog = false,
  logContext = 'createReport',
  flushBuffer = false,
) {
  const apiOperation = 'createReport';
  const endpoint = '/reports/2021-06-30/reports';
  const method = 'POST';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      (queryParams = {}),
      {
        reportType,
        marketplaceIds,
        dataStartTime,
        dataEndTime,
      },
      logContext,
      createLog,
      flushBuffer,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 0.0167, burst: 15 }),
    );
    return response.data;
  } catch (error) {
    if (createLog) {
      logger(`Error in createReport: ${error}\n`, logContext, '', flushBuffer);
    }
    console.error(`Error in createReport`);
    throw error;
  }
}

module.exports = { createReport };
