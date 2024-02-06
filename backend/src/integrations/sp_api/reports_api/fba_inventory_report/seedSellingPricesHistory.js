const db = require('../../../../api/models/index');
const { logger } = require('../../../../utils/logger');

/**
 * @function seedSellingPriceHistory
 * @description Populates the SellingPriceHistory table with recent data.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @async
 * @return {Promise<void>} - A promise that resolves when the SellingPriceHistory table has been populated with recent data.
 */
async function seedSellingPriceHistory(
  createLog = false,
  logContext = 'seedSellingPriceHistory',
) {
  let logMessage = '';

  try {
    const inventoryUpdates = await db.AfnInventoryDailyUpdate.findAll();

    for (const update of inventoryUpdates) {
      try {
        const dateString = update.updatedAt.toISOString().split('T')[0];

        if (update.afnFulfillableQuantity > 0) {
          const record = {
            skuId: update.skuId,
            dailyPrice: update.actualPrice,
            currencyCode: update.currencyCode,
            date: dateString,
          };

          await db.SellingPriceHistory.upsert(record, {
            where: { skuId: update.skuId, date: dateString },
          });

          logMessage += `Record for SKU ID: ${update.skuId} on ${dateString} inserted/updated in SellingPriceHistory.\n`;
        }
      } catch (innerError) {
        logMessage += `Error processing record for SKU ID: ${update.skuId}: ${innerError}\n`;
        console.error(
          `Error processing record for SKU ID: ${update.skuId}:`,
          innerError,
        );
      }
    }
  } catch (error) {
    logMessage += `Error seeding SellingPriceHistory: ${error}\n`;
    console.error('Error seeding SellingPriceHistory:', error);
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  seedSellingPriceHistory,
};
