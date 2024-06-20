const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const {
  calculateSellingPrices,
} = require('../../utils/calculateSellingPrices');

/**
 * @description This function creates a minimum selling price record in the database if it does not exist.
 * @function automaticallyCreateMinSellingPriceRecord
 * @param {number} skuId - The ID of the SKU for which to create a minimum selling price record.
 * @param {boolean} createLog - Whether to create a log for this operation.
 * @param {string} logContext - The context for the log message.
 */
async function automaticallyCreateMinSellingPriceRecord(
  skuId,
  createLog = false,
  logContext = 'automaticallyCreateMinSellingPriceRecord',
) {
  let logMessage = '';

  try {
    const sellingPrices = await calculateSellingPrices(skuId, true, logContext);

    const {
      LocalAndPanEU: {
        minimumSellingPrice: minimumSellingPriceLocalAndPanEu,
        maximumSellingPrice: maximumSellingPriceLocalAndPanEu,
      },
      EFN: {
        minimumSellingPrice: minimumSellingPriceEfn,
        maximumSellingPrice: maximumSellingPriceEfn,
      },
      currencyCode,
    } = sellingPrices;

    // Create minimum selling price record
    const newMinimumSellingPriceRecord = await db.MinimumSellingPrice.create({
      skuId,
      pricingRuleId: 1,
      enrolledInPanEu: false,
      eligibleForPanEu: false,
      minimumSellingPriceLocalAndPanEu,
      minimumSellingPriceEfn,
      maximumSellingPriceLocalAndPanEu,
      maximumSellingPriceEfn,
      currencyCode,
    });

    if (newMinimumSellingPriceRecord.minimumSellingPriceId) {
      eventBus.emit('recordCreated', {
        type: 'minimumSellingPrice',
        action: 'minimumSellingPrice_created',
        id: newMinimumSellingPriceRecord.minimumSellingPriceId,
      });
    }
  } catch (error) {
    console.error(
      `Error in automaticallyCreateMinSellingPriceRecord: ${error}`,
    );
    logMessage += ` Error encountered in automaticallyCreateMinSellingPriceRecord for SKU ID ${skuId}. ERROR: ${error}.`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { automaticallyCreateMinSellingPriceRecord };
