const ApiRequestor = require('../connection/apiRequestor');

/**
 * Manages report operations for the Amazon Selling Partner API.
 */
class ReportsManager {
  /**
   * Initializes the ReportsManager with necessary configurations.
   * @param {string} baseUrl - The base URL for the SP API.
   */
  constructor(baseUrl) {
    this.apiRequestor = new ApiRequestor(baseUrl);
  }

  /**
   * @method getReportDocument
   * @description Fetches reports based on the specified filters.
   * @async
   * @param {Object} filters - The filters to apply when fetching the reports.
   *    - reportTypes {string[]} (optional): A list of report types used to filter reports.
   *      Min count: 1, Max count: 10.
   *    - processingStatuses {string[]} (optional): A list of processing statuses used to filter reports.
   *      Min count: 1.
   *    - marketplaceIds {string[]} (optional): A list of marketplace identifiers used to filter reports.
   *      The reports returned will match at least one of the marketplaces that you specify.
   *      Min count: 1, Max count: 10.
   *    - pageSize {number} (optional): The maximum number of reports to return in a single call.
   *      Minimum: 1, Maximum: 100. Default: 10.
   *    - createdSince {string} (optional): The earliest report creation date and time for reports to include
   *      in the response, in ISO 8601 date time format. The default is 90 days ago.
   *    - createdUntil {string} (optional): The latest report creation date and time for reports to include
   *      in the response, in ISO 8601 date time format. The default is now.
   *    - nextToken {string} (optional): A string token returned in the response to your previous request.
   *      nextToken is returned when the number of results exceeds the specified pageSize value. To get the
   *      next page of results, call the getReports operation and include this token as the only parameter.
   *      Specifying nextToken with any other parameters will cause the request to fail.
   * @return {Promise<Object>} The response from the API.
   * @throws {Error} If an error occurs while fetching the reports.
   */
  async getReports(filters) {
    const endpoint = '/reports/2021-06-30/reports';
    const method = 'GET';

    try {
      // Send the request using the ApiRequestor
      const response = await this.apiRequestor.sendRequest(
        method,
        endpoint,
        filters,
        {}, // Body is empty for GET requests
      );
      return response; // Return the response data from the API
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }
}

module.exports = ReportsManager;
