const { spApiInstance } = require('../spApiConnector');

/**
 * Retrieves the URL of the report document from Amazon Selling Partner API.
 *
 * @async
 * @function getDocumentUrl
 * @param {string} reportDocumentId - The report document ID.
 * @param {boolean} createLog - Whether to create a log file for the request.
 * @param {string} reportType - The type of report being requested.
 * @return {Promise<string>} - A promise that resolves to the URL of the report document.
 */
async function getDocumentUrl(reportDocumentId, createLog, reportType) {
  const path = `/reports/2021-06-30/documents/${reportDocumentId}`;

  try {
    const response = await spApiInstance.sendRequest(
      'GET',
      path,
      {},
      {},
      createLog,
      reportType,
    );

    const parsedResponse = response.data;
    const documentUrl = parsedResponse.url;
    const compressionAlgorithm = parsedResponse.compressionAlgorithm;
    const reportDocumentId = parsedResponse.reportDocumentId;

    console.log('Document URL:', documentUrl);

    return { documentUrl, compressionAlgorithm, reportDocumentId };
  } catch (error) {
    console.error(`Error fetching document URL: ${error}`);
    throw error;
  }
}

module.exports = { getDocumentUrl };
