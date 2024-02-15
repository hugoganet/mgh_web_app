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
    const {
      LocalAndPanEU: {
        minimumSellingPrice: minimumSellingPriceLocalAndPanEu,
        maximumSellingPrice: maximumSellingPriceLocalAndPanEu,
      },
      EFN: {
        minimumSellingPrice: minimumSellingPriceEfn,
        maximumSellingPrice: maximumSellingPriceEfn,
      },
    } = await calculateSellingPrices(skuId);

    // Create minimum selling price record
    const newMinimumSellingPriceRecord = await db.MinimumSellingPrice.create({
      skuId,
      pricingRuleId: 1,
      enrolledInPanEu: false,
      eligibleForPanEu: false,
      referralFeeCategoryId: data.referralFeeCategoryId,
      minimumMarginAmount: data.minimumMarginAmount,
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

    console.log(
      `Minimum Selling Price Local/Pan-EU: ${minimumSellingPriceLocalAndPanEu}`,
    );
    console.log(
      `Maximum Selling Price Local/Pan-EU: ${maximumSellingPriceLocalAndPanEu}`,
    );
    console.log(`Minimum Selling Price EFN: ${minimumSellingPriceEfn}`);
    console.log(`Maximum Selling Price EFN: ${maximumSellingPriceEfn}`);
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

// automaticallyCreateMinSellingPriceRecord(2, true); // Book Low-price
automaticallyCreateMinSellingPriceRecord(3635, true); // Low-price, reduced referral fee
