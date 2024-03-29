const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');

/**
 * @description This function finds or creates an ASIN-SKU record in the database if it does not exist.
 * @async
 * @function findOrCreateAfnInventoryDailyUpdateRecord
 * @param {string} skuId - The SKU ID for which to create a record.
 * @param {string} sku - The SKU for which to create a record.
 * @param {string} countryCode - The country code for which to create a record.
 * @param {string} currencyCode - The currency code for which to create a record.
 * @param {number} skuAverageSellingPrice - The average selling price of the SKU.
 * @param {number} skuAfnTotalQuantity - The total AFN quantity for the SKU.
 * @param {string} reportDocumentId - The document ID of the report being processed.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 */
async function findOrCreateAfnInventoryDailyUpdateRecord(
  skuId,
  sku,
  countryCode,
  currencyCode,
  skuAverageSellingPrice,
  skuAfnTotalQuantity,
  reportDocumentId,
  createLog = false,
  logContext,
) {
  let logMessage = '';
  try {
    const [afnInventoryRecord, createdAfnInventoryRecord] =
      await db.AfnInventoryDailyUpdate.findOrCreate({
        where: { skuId: skuRecord.skuId },
        defaults: {
          skuId: skuRecord.skuId,
          sku,
          countryCode,
          currencyCode,
          actualPrice: skuAverageSellingPrice,
          afnFulfillableQuantity: skuAfnTotalQuantity,
          reportDocumentId,
        },
      });
    // If the record already existed, update the actualPrice and afnFulfillableQuantity fields
    if (!createdAfnInventoryRecord) {
      eventBus.emit('recordCreated', {
        type: 'afnInventoryDailyUpdate',
        action: 'afnInventoryDailyUpdate_updated',
        id: afnInventoryDailyUpdate.afnInventoryDailyUpdateId,
      });
      afnInventoryRecord.actualPrice = skuAverageSellingPrice;
      afnInventoryRecord.afnFulfillableQuantity = skuAfnTotalQuantity;
      afnInventoryRecord.reportDocumentId = reportDocumentId;
      await afnInventoryRecord.save();
      logMessage += `Updated existing AfnInventoryDailyUpdate record for skuId: ${skuId}.\n`;
    } else {
      eventBus.emit('recordCreated', {
        type: 'afnInventoryDailyUpdate',
        action: 'afnInventoryDailyUpdate_created',
        id: afnInventoryDailyUpdate.afnInventoryDailyUpdateId,
      });
      logMessage += `Created new AfnInventoryDailyUpdate record for skuId: ${skuId}.\n`;
    }
    return afnInventoryRecord;
  } catch (error) {
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  findOrCreateAfnInventoryDailyUpdateRecord,
};
