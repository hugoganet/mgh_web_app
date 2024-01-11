const { spApiInstance } = require('../../connection/spApiConnector');
const marketplaces = require('../../../../config/marketplaces');
const calculateNextReportCreationTime = require('../../schedule_reports/calculateNextReportCreationTime');

/**
 * @async
 * @function createReportSchedule
 * @description This function sets up a schedule for automatic report generation on Amazon SP API.
 * @param {Object} config - Configuration parameters for the report schedule.
 * @param {array} config.marketplaceIds - The marketplace identifier for which the report is scheduled.
 * @param {string} config.reportType - The type of report being scheduled.
 * @param {string} config.period - The frequency of the report generation.
 * @param {string} config.nextReportCreationTime - (Optional) The date and time for the next report creation.
 * @return {Promise<string>} - A promise that resolves to the report schedule ID.
 */
async function createReportSchedule(config) {
  const { marketplaceIds, reportType, period, nextReportCreationTime } = config;

  const apiOperation = 'createReportSchedule';
  const endpoint = '/reports/2021-06-30/schedules';
  const method = 'POST';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      {}, // No query parameters for this request
      {
        reportType,
        marketplaceIds: [marketplaceIds],
        period,
        nextReportCreationTime,
      },
      true,
      apiOperation,
      false,
    );

    console.log(response.data.reportScheduleId);
    return response.data.reportScheduleId;
  } catch (error) {
    console.error('Error creating report schedule:', error);
    throw error;
  }
}

// Example usage: Creating a daily report schedule for the France marketplace
// This part of the code should be run only when you want to set up or update the report schedule.
const config = {
  marketplaceIds: marketplaces.france.marketplaceId,
  reportType: 'GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA',
  period: 'P1D', // Daily report generation
  nextReportCreationTime: calculateNextReportCreationTime('14:00:00'),
};

createReportSchedule(config);

module.exports = { createReportSchedule };
