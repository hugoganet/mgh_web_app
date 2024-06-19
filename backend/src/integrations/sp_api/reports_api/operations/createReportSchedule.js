/* eslint-disable no-unused-vars */
const { spApiInstance } = require('../../connection/spApiConnector');
const marketplaces = require('../../../../utils/marketplaces.js');
const calculateNextReportCreationTime = require('../../../../utils/calculateNextReportCreationTime');
const moment = require('moment'); // Using moment.js for easy date manipulation

/**
 * @async
 * @function createReportSchedule
 * @description This function sets up a schedule for automatic report generation on Amazon SP API.
 * @param {Object} config - Configuration parameters for the report schedule.
 * @param {array} config.marketplaceIds - The marketplace identifier for which the report is scheduled.
 * @param {string} config.reportType - The type of report being scheduled.
 * @param {string} config.period - The frequency of the report generation.
 * @param {string} config.nextReportCreationTime - (Optional) The date and time for the next report creation.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise<string>} - A promise that resolves to the report schedule ID.
 */
async function createReportSchedule(
  config,
  createLog = false,
  logContext = 'createReportSchedule',
  flushBuffer = false,
) {
  const { marketplaceIds, reportType, period, nextReportCreationTime } = config;

  const apiOperation = 'createReportSchedule';
  const endpoint = '/reports/2021-06-30/schedules';
  const method = 'POST';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      (queryParams = {}),
      {
        reportType,
        marketplaceIds: marketplaceIds,
        period,
        nextReportCreationTime,
      },
      logContext,
      createLog,
      flushBuffer,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 0.0222, burst: 10 }),
    );
    return response.data.reportScheduleId;
  } catch (error) {
    console.error('Error creating report schedule:', error);
    throw error;
  }
}

module.exports = { createReportSchedule };

const scheduleTime = moment().hour(4).minute(0).second(0); // Today at 04:00:00

// Calculating start and end times for the previous day's data
const dataEndTime = scheduleTime.clone(); // End time is the current scheduling time (04:00:00 on the current day)
const dataStartTime = scheduleTime.clone().subtract(1, 'days'); // Start time is 24 hours before the end time

// Format times for your configuration
const formattedDataStartTime = dataStartTime.format('YYYY-MM-DDTHH:mm:ss');
const formattedDataEndTime = dataEndTime.format('YYYY-MM-DDTHH:mm:ss');

console.log(formattedDataStartTime, formattedDataEndTime);

const config = {
  marketplaceIds: [
    // marketplaces.unitedKingdom.marketplaceId,
    marketplaces.france.marketplaceId,
    // marketplaces.germany.marketplaceId,
    // marketplaces.italy.marketplaceId,
    // marketplaces.spain.marketplaceId,
    // marketplaces.netherlands.marketplaceId,
    // marketplaces.sweden.marketplaceId,
    // marketplaces.poland.marketplaceId,
    // marketplaces.turkey.marketplaceId,
    // marketplaces.belgium.marketplaceId,
  ],
  reportType: 'GET_FBA_FULFILLMENT_REMOVAL_SHIPMENT_DETAIL_DATA',
  reportOptions: {
    dataStartTime: formattedDataStartTime,
    dataEndTime: formattedDataEndTime,
  },
  period: 'P1D', // Daily report generation
  nextReportCreationTime: calculateNextReportCreationTime('04:00:00'),
};

createReportSchedule(config);
