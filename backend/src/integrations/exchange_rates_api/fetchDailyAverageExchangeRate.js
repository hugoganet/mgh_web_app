require('dotenv').config({
  path: '/Users/hugoganet/Code/projet_MGH/mgh_web_app/backend/.env',
});
const axios = require('axios');
const { logger } = require('../../utils/logger');
const {
  saveHistoricalExchangeRates,
} = require('./saveHistoricalExchangeRates');

/**
 * @function fetchDailyAverageExchangeRate
 * @description Fetches historical exchange rates from the Exchange Rates API
 * @param {date} date - The date for which to fetch the exchange rates (YYYY-MM-DD)
 * @param {string} currencyCode - The currency code for which to fetch the exchange rates
 * @param {boolean} createLog - Whether to create a log of the process
 * @return {Promise<Object>} - A promise that resolves to an object with the currency codes as keys and their exchange rates as values
 */
async function fetchDailyAverageExchangeRate(
  date,
  currencyCode,
  createLog = false,
) {
  let logMessage = `Fetching historical exchange rates for date ${date} with currencyCode: ${currencyCode}\n`;
  const apiKey = process.env.EXCHANGE_RATES_API_KEY;
  const baseCurrency = 'EUR';
  const url = `http://api.exchangeratesapi.io/v1/${date}?access_key=${apiKey}&base=${baseCurrency}&symbols=${currencyCode}`;

  try {
    logMessage += `Request Details:\nURL: ${url}\n`;
    const response = await axios.get(url);
    logMessage += `\nResponse Details:\n${JSON.stringify(
      {
        Data: response.data,
        Status: response.status,
        Headers: response.headers,
      },
      null,
      2,
    )}\n`;

    // Save the exchange rates to the database
    if (response.data && response.data.rates) {
      await saveHistoricalExchangeRates(response.data.rates, date, true);
    }
  } catch (error) {
    logMessage += `Error: ${error.message}\n`;
    if (error.response) {
      logMessage += `Response Error Details:\n${JSON.stringify(
        {
          Data: error.response.data,
          Status: error.response.status,
          Headers: error.response.headers,
        },
        null,
        2,
      )}\n`;
    } else if (error.request) {
      logMessage += `Request Details (No response received):\n${JSON.stringify(
        error.request,
        null,
        2,
      )}\n`;
    }
    console.error(
      `Error fetching historical exchange rates for date ${date}:`,
      error,
    );
    return null;
  } finally {
    if (createLog) {
      logger(logMessage, 'fetchDailyAverageExchangeRate');
    }
  }
}

module.exports = { fetchDailyAverageExchangeRate };

// fetchDailyAverageExchangeRate('2024-01-28', 'GBP,SEK,PLN,TRY', true);
