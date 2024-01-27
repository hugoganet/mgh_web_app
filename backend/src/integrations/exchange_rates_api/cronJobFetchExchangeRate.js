#!/opt/homebrew/bin/node

const {
  fetchDailyAverageExchangeRate,
} = require('./fetchDailyAverageExchangeRate');

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const dateString = yesterday.toISOString().split('T')[0];

fetchDailyAverageExchangeRate(dateString, 'GBP,SEK,PLN,TRY', true);
