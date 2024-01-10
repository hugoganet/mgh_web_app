const { spApiInstance } = require('../spApiConnector');
const marketplaces = require('../../../../config/marketplaces');
const calculateNextReportCreationTime = require('../../schedule_reports/calculateNextReportCreationTime');
const { createDestination, createSubscription } = require('../amazonSqsSetup');
const sqsArn = process.env.SQS_ARN;
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
  const path = '/reports/2021-06-30/schedules';

  try {
    const response = await spApiInstance.sendRequest(
      'POST',
      path,
      {}, // No query parameters for this request
      {
        reportType,
        marketplaceIds: [marketplaceIds],
        period,
        nextReportCreationTime,
      },
      true,
      reportType,
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

createReportSchedule(config)
  .then(scheduleId => {
    console.log(`Report scheduled successfully. Schedule ID: ${scheduleId}`);
    return createDestination(sqsArn); // Return the promise from createDestination
  })
  .then(destinationId => {
    console.log(
      `Destination created successfully. Destination ID: ${destinationId}`,
    );
    return createSubscription(destinationId, 'REPORT_PROCESSING_FINISHED'); // Return the promise from createSubscription
  })
  .then(subscriptionId => {
    console.log(
      `Subscription created successfully. Subscription ID: ${subscriptionId}`,
    );
  })
  .catch(error => console.error('Error in report scheduling process:', error));

module.exports = { createReportSchedule };
