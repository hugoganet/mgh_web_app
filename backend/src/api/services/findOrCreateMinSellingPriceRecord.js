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
      minimumSellingPriceRecord =
        await automaticallyCreateMinSellingPriceRecord(skuId, true, logContext);

      logMessage += `Created new minimumSellingPrice record for SKU: ${skuId}\n`;

      if (!minimumSellingPriceRecord) {
        throw new Error(
          `Failed to create minimumSellingPrice record for SKU: ${skuId}`,
        );
      }
    }

    return minimumSellingPriceRecord;
  } catch (error) {
    logMessage += `Error in findOrCreateMinSellingPrice for skuId: ${skuId}: ${error.message}\n`;
    throw error; // Rethrow the error to ensure it is handled by the calling function
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  findOrCreateMinSellingPriceRecord,
};
