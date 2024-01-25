require('dotenv').config({ path: 'backend/.env' });
const axios = require('axios');
const { logAndCollect } = require('../sp_api/logs/logger');

/**
 * @function fetchHistoricalExchangeRates
 * @description Fetches historical exchange rates from the Exchange Rates API
 * @param {date} date - The date for which to fetch the exchange rates (YYYY-MM-DD)
 * @param {string} symbols
 * @param {boolean} createLog - Whether to create a log of the process
 * @return {Promise<Object>} - A promise that resolves to an object with the currency codes as keys and their exchange rates as values
 */
async function fetchHistoricalExchangeRates(date, symbols, createLog = false) {
  let logMessage = `Fetching historical exchange rates for date ${date} with symbols: ${symbols}\n`;
  const apiKey = process.env.EXCHANGE_RATES_API_KEY;
  const baseCurrency = 'EUR';
  const url = `http://api.exchangeratesapi.io/v1/${date}?access_key=${apiKey}&base=${baseCurrency}&symbols=${symbols}`;

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
    return response.data.rates;
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
      logAndCollect(logMessage, 'fetchHistoricalExchangeRates');
    }
  }
}

module.exports = { fetchHistoricalExchangeRates };

// Example call to test logging
fetchHistoricalExchangeRates('2013-12-24', 'SEK,PLN,TRY,GBP', true);
