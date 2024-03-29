const db = require('../../src/api/models/index');
const { logger } = require('../utils/logger');

/**
 * Converts an amount in a given currency to EUR.
 * @async
 * @param {number} amount - The amount to convert.
 * @param {string} currency - The currency of the amount.
 * @param {Date} date - The date of the amount.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<number>} - A promise that resolves to the converted amount.
 */
async function convertToEur(
  amount,
  currency,
  date,
  createLog = false,
  logContext = 'convertToEur',
) {
  try {
    let exchangeRateRecord = await db.DailyAverageExchangeRate.findOne({
      where: {
        currencyCode: currency,
        date: date,
      },
    });

    // If not found, check for the most recent date before the given date
    if (!exchangeRateRecord) {
      exchangeRateRecord = await db.DailyAverageExchangeRate.findOne({
        where: {
          currencyCode: currency,
          date: {
            [db.Sequelize.Op.lt]: date,
          },
        },
        order: [['date', 'DESC']],
      });
    }

    if (exchangeRateRecord) {
      if (createLog) {
        logger(
          `Converted ${currency} ${amount} to EUR: ${
            amount * exchangeRateRecord.rateToEur
          }\n`,
          logContext,
        );
      }
      return amount * exchangeRateRecord.rateToEur;
    } else {
      if (createLog) {
        logger(`Exchange rate not found for ${currency}\n`, logContext);
      }
      throw new Error(`Exchange rate not found for ${currency}`);
    }
  } catch (error) {
    if (createLog) {
      logger(`Error in convertToEur: ${error.message}\n`, logContext);
    }
    console.error(`Error in convertToEur: ${error.message}`);
    throw error;
  }
}

module.exports = { convertToEur };
