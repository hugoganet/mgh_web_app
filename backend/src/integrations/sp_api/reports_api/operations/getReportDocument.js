const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Retrieves the URL of the report document from Amazon Selling Partner API.
 *
 * @async
 * @function getReportDocument
 * @param {string} reportDocumentId - The report document ID.
 * @param {boolean} createLog - Whether to create a log file for the request.
 * @param {string} reportType - The type of report being requested.
 * @return {Promise<string>} - A promise that resolves to the URL of the report document.
 */
async function getReportDocument(reportDocumentId, createLog, reportType) {
  const apiOperation = 'getReportDocument';
  const endpoint = `/reports/2021-06-30/documents/${reportDocumentId}`;
  const method = 'GET';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      {},
      {},
      createLog,
      apiOperation,
      false,
    );

    const parsedResponse = response.data;
    const documentUrl = parsedResponse.url;
    const compressionAlgorithm = parsedResponse.compressionAlgorithm;
    const reportDocumentId = parsedResponse.reportDocumentId;

    // console.log('Document URL from getReportDocument => ', documentUrl);

    return { documentUrl, compressionAlgorithm, reportDocumentId };
  } catch (error) {
    console.error(`Error fetching document URL: ${error}`);
    throw error;
  }
}

module.exports = { getReportDocument };
