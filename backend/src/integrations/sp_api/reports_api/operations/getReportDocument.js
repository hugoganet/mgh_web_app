const { spApiInstance } = require('../../connection/spApiConnector');
const { logger } = require('../../../../utils/logger');

/**
 * Retrieves the URL of the report document from Amazon Selling Partner API.
 *
 * @async
 * @function getReportDocument
 * @param {string} reportDocumentId - The report document ID.
 * @param {boolean} createLog - Whether to create a log file for the request.
 * @param {string} logContext - The context for the log file.
 * @return {Promise<string>} - A promise that resolves to the URL of the report document.
 */
async function getReportDocument(reportDocumentId, createLog, logContext) {
  const apiOperation = 'getReportDocument';
  const endpoint = `/reports/2021-06-30/documents/${reportDocumentId}`;
  const method = 'GET';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      {},
      {},
      logContext,
      createLog,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 0.0167, burst: 15 }),
    );

    const parsedResponse = response.data;
    const documentUrl = parsedResponse.url;
    const compressionAlgorithm = parsedResponse.compressionAlgorithm;
    const reportDocumentId = parsedResponse.reportDocumentId;

    return { documentUrl, compressionAlgorithm, reportDocumentId };
  } catch (error) {
    if (createLog) {
      logger(`Error in getReportDocument: ${error}\n`, logContext);
    }
    console.error(`Error in getReportDocument`);
    throw error;
  }
}

module.exports = { getReportDocument };
