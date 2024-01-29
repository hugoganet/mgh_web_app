const { logAndCollect } = require('../sp_api/logs/logger');
const db = require('../../api/models/index');

/**
 * @function saveHistoricalExchangeRates
 * @description Saves historical exchange rates into the database.
 * @param {Object} ratesData - Data containing exchange rates.
 * @param {string} date - Date for which rates are fetched (YYYY-MM-DD).
 * @param {boolean} createLog - Whether to create a log of the process.
 */
async function saveHistoricalExchangeRates(ratesData, date, createLog = false) {
  let logMessage = `Saving historical exchange rates for date ${date}\n`;
  const now = new Date();
  try {
    for (const [currencyCode, rateToEur] of Object.entries(ratesData)) {
      await db.DailyAverageExchangeRate.upsert({
        currencyCode,
        rateToEur,
        date,
      });
      logMessage += `${now} : Saved exchange rate for ${currencyCode} on ${date}: ${rateToEur}\n`;
      console.log(
        `${now} : Saved exchange rate for ${currencyCode} on ${date}: ${rateToEur}`,
      );
    }
  } catch (error) {
    logMessage += `Error saving exchange rates to database: ${error}\n`;
    console.error('Error saving exchange rates to database:', error);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'SaveHistoricalExchangeRates');
    }
  }
}

module.exports = {
  saveHistoricalExchangeRates,
};
