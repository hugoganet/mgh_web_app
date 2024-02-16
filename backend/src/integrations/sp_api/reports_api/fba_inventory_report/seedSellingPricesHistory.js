const db = require('../../../../api/models/index');
const { logger } = require('../../../../utils/logger');
const eventBus = require('../../../../utils/eventBus');

/**
 * @description Populates the SellingPriceHistory table with recent data.
 * @function seedSellingPriceHistory
 * @async
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<void>} - A promise that resolves when the SellingPriceHistory table has been populated with recent data.
 */
async function seedSellingPriceHistory(
  createLog = false,
  logContext = 'seedSellingPriceHistory',
) {
  let logMessage = '';

  try {
    // Fetch all afnInventoryDailyUpdate records
    const afnInventoryDailyUpdateRecords =
      await db.AfnInventoryDailyUpdate.findAll();

    for (const record of afnInventoryDailyUpdateRecords) {
      try {
        const dateString = record.updatedAt.toISOString().split('T')[0];

        // If the afnInventoryDailyUpdate record has no fulfillable quantity, skip it (no need to update nor createsellingPriceHistory record)
        if (record.afnFulfillableQuantity <= 0) {
          continue;
        } else {
          // If none sellingPriceHistory record was found for the skuId and date, create one.
          const [sellingPriceHistoryRecord, createdsellingPriceHistoryRecord] =
            await db.SellingPriceHistory.findOrCreate({
              where: { skuId: record.skuId, date: dateString },
              defaults: {
                skuId: record.skuId,
                dailyPrice: record.actualPrice,
                currencyCode: record.currencyCode,
                date: dateString,
              },
            });

          if (createdsellingPriceHistoryRecord) {
            eventBus.emit('recordCreated', {
              type: 'sellingPriceHistory',
              action: 'sellingPriceHistory_created',
              id: sellingPriceHistoryRecord.skuId,
            });
            logMessage += `Record for SKU ID: ${sellingPriceHistoryRecord.skuId} on ${dateString} created in SellingPriceHistory.\n`;
          } else {
            eventBus.emit('recordCreated', {
              type: 'sellingPriceHistory',
              action: 'sellingPriceHistory_found',
              id: sellingPriceHistoryRecord.skuId,
            });
            logMessage += `Record for SKU ID: ${sellingPriceHistoryRecord.skuId} on ${dateString} found in SellingPriceHistory.\n`;
          }
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
