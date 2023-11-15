const { spApiInstance } = require('../spApiConnector');

/**
 * Retrieves the URL of the report document from Amazon Selling Partner API.
 *
 * @async
 * @function getDocumentUrl
 * @param {string} reportDocumentId - The report document ID.
 * @param {boolean} createLog - Whether to create a log file for the request.
 * @return {Promise<string>} - A promise that resolves to the URL of the report document.
 */
async function getDocumentUrl(reportDocumentId, createLog) {
  const path = `/reports/2021-06-30/documents/${reportDocumentId}`;

  try {
    const response = await spApiInstance.sendRequest(
      'GET',
      path,
      {},
      {},
      createLog,
    );

    const parsedResponse = response.data;
    const documentUrl = parsedResponse.url;
    const compressionAlgorithm = parsedResponse.compressionAlgorithm; // Could be 'GZIP', etc.

    console.log('Document URL:', documentUrl);

    return { documentUrl, compressionAlgorithm };
  } catch (error) {
    console.error(`Error fetching document URL: ${error}`);
    throw error;
  }
}

module.exports = { getDocumentUrl };
