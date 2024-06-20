const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const {
  automaticallyCreateMinSellingPriceRecord,
} = require('./automaticallyCreateMinSellingPriceRecord.js');

/**
 * @description This function finds or creates an ASIN record in the database if it does not exist.
 * @async
 * @function findOrCreateMinSellingPriceRecord
 * @param {string} skuId - The SKU ID associated with the ASIN record.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 */
async function findOrCreateMinSellingPriceRecord(skuId, createLog, logContext) {
  let logMessage = '';
  try {
    let minimumSellingPriceRecord = await db.MinimumSellingPrice.findOne({
      where: {
        skuId,
      },
    });
    if (minimumSellingPriceRecord) {
      eventBus.emit('recordCreated', {
        type: 'minimumSellingPrice',
        action: 'minimumSellingPrice_found',
        id: minimumSellingPriceRecord.minimumSellingPriceId,
      });
      logMessage += `Found minimumSellingPrice record for SKU: ${skuId}\n`;
    } else {
      // else if (!associatedAsinRecord) {
      // I don't know what "associatedAsinRecord" is, but it's not defined in this function.
      minimumSellingPriceRecord =
        await automaticallyCreateMinSellingPriceRecord(
          skuRecord.skuId,
          true,
          logContext,
        );
      logMessage += `No minimumSellingPrice record found in findOrCreateMinSellingPriceRecord. Created new record for ASIN: ${asin} in ${countryCode}\n`;
    }
    return minimumSellingPriceRecord;
  } catch (error) {
    logMessage += `Error in findOrCreateMinSellingPrice for skuId: ${skuId}.\n`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  findOrCreateMinSellingPriceRecord,
};
