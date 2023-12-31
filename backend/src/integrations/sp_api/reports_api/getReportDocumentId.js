const { spApiInstance } = require('../spApiConnector');

/**
 * Retrieves the report document ID for a given report ID from the Amazon Selling Partner API.
 * This function polls the API until the report is ready and the document ID is available.
 *
 * @async
 * @function getReportDocumentId
 * @param {string} reportId - The unique identifier of the report for which the document ID is being fetched.
 * @param {boolean} createLog - Whether to create a log file for the request.
 * @param {string} reportType - The type of report being requested.
 * @return {Promise<void>} A promise that resolves when the report document ID is successfully retrieved.
 * @throws {Error} Throws an error if there is an issue fetching the report document ID.
 * @description This function continuously polls the Amazon SP API at 60-second intervals to check if the report
 *              associated with the provided report ID is ready. Once the report is ready and the report document ID
 *              is available, the function breaks out of the loop and logs the report document ID. This function
 *              should be used in sequence after requesting a report and obtaining a report ID.
 */
async function getReportDocumentId(reportId, createLog, reportType) {
  const path = `/reports/2021-06-30/reports/${reportId}`;

  let reportDocumentId = null;
  let response;

  while (reportDocumentId === null) {
    try {
      response = await spApiInstance.sendRequest(
        'GET',
        path,
        {},
        {},
        createLog,
        reportType,
      );

      const parsedResponse = response.data;

      if (parsedResponse.reportDocumentId) {
        reportDocumentId = parsedResponse.reportDocumentId;
        console.log('Report Document ID fetched:', reportDocumentId);
        break;
      } else {
        console.log('Waiting for report to be ready...');
        await new Promise(resolve => setTimeout(resolve, 60000 * 5)); // Wait for 5 minutes
      }
    } catch (error) {
      console.error(`Error while fetching report document ID: ${error}`);
      throw error;
    }
  }

  if (!reportDocumentId) {
    console.log('Report is not ready after multiple attempts.');
  }

  return reportDocumentId; // Optional: Return the document ID for further processing
}

module.exports = { getReportDocumentId };
