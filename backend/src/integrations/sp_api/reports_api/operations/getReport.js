const { spApiInstance } = require('../../connection/spApiConnector');
const { logger } = require('../../../../utils/logger');

/**
 * @async
 * @function getReport
 * @param {string} reportId - The unique identifier of the report for which the document ID is being fetched.
 * @param {boolean} createLog - Whether to create a log file for the request.
 * @param {string} logContext - The context for the log file.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise<void>} A promise that resolves when the report document ID is successfully retrieved.
 * @throws {Error} Throws an error if there is an issue fetching the report document ID.
 * @description This function continuously polls the Amazon SP API at 60-second intervals to check if the report
 *              associated with the provided report ID is ready. Once the report is ready and the report document ID
 *              is available, the function breaks out of the loop and logs the report document ID. This function
 *              should be used in sequence after requesting a report and obtaining a report ID.
 */
async function getReport(
  reportId,
  createLog = false,
  logContext = 'getReport',
  flushBuffer = false,
) {
  const apiOperation = 'getReport';
  const endpoint = `/reports/2021-06-30/reports/${reportId}`;
  const method = 'GET';
  const reportDocumentId = null;

  while (reportDocumentId === null) {
    try {
      const response = await spApiInstance.sendRequest(
        method,
        endpoint,
        (queryParams = {}),
        (body = {}),
        logContext,
        createLog,
        flushBuffer,
        apiOperation,
        (isGrantless = false),
        (rateLimitConfig = { rate: 2, burst: 15 }),
      );

      if (response.data.reportDocumentId) {
        console.log(
          'Report Document ID fetched:',
          response.data.reportDocumentId,
        );
        return response.data;
      } else {
        console.log('Waiting for report to be ready...');
        await new Promise(resolve => setTimeout(resolve, 60000 * 5)); // Wait for 5 minutes
      }
    } catch (error) {
      if (createLog) {
        logger(`Error in getReport: ${error}\n`, logContext, '', flushBuffer);
      }
      console.error(`Error in getReport`);
      throw error;
    }
  }
}

module.exports = { getReport };
