const db = require('../../src/api/models/index');

/**
 * Converts an amount in a given currency to EUR.
 * @async
 * @param {number} amount - The amount to convert.
 * @param {string} currency - The currency of the amount.
 * @param {Date} date - The date of the amount.
 * @return {Promise<number>} - A promise that resolves to the converted amount.
 */
async function convertToEur(amount, currency, date) {
  try {
    // Check in db.DailyAverageExchangeRate if there is a record for the given date and currency
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

    // If an exchange rate is found, return the amount * exchangeRate
    if (exchangeRateRecord) {
      console.log(amount * exchangeRateRecord.rateToEur);
      return amount * exchangeRateRecord.rateToEur;
    } else {
      throw new Error(`Exchange rate not found for ${currency} on ${date}`);
    }
  } catch (error) {
    console.error(`Error in convertToEur: ${error.message}`);
    throw error;
  }
}

module.exports = { convertToEur };
