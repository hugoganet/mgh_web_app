const { getReportId } = require('./getReportId');
const markeplaces = require('../../../../src/config/marketplaces');

/**
 * Requests an FBA Inventory report from the Amazon Selling Partner API.
 *
 * @async
 * @function requestFbaInventoryReport
 * @param {string} marketplaceId - The marketplace identifier for which the report is requested.
 * @param {string} startDate - The start date and time for the report data in ISO 8601 format.
 * @param {string} endDate - The end date and time for the report data in ISO 8601 format.
 * @return {Promise<void>} - A promise that resolves when the report request is completed.
 */
async function requestFbaInventoryReport(marketplaceId, startDate, endDate) {
  const config = {
    marketplaceId: marketplaceId,
    reportType: 'GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA',
    dataStartTime: startDate,
    dataEndTime: endDate,
  };

  try {
    const reportIdResponse = await getReportId(config);
    console.log('FBA Inventory Report ID:', reportIdResponse.reportId);
    // Further processing, such as getting the report document, can be done here
  } catch (error) {
    console.error('Error in requesting FBA Inventory report:', error);
  }
}
requestFbaInventoryReport(markeplaces.france.marketplaceId, null, null);

module.exports = { requestFbaInventoryReport };
