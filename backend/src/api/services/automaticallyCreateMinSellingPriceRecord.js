const db = require('../../api/models');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');
const {
  calculateSellingPrices,
} = require('../../utils/calculateSellingPrices');
const {
  fetchDataForSellingPriceCalculation,
} = require('./fetchDataForSellingPriceCalculation');

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
    // Fetch all necessary data
    const data = await fetchDataForSellingPriceCalculation(
      skuId,
      false,
      logContext,
    );

    // Convert currency if necessary
    const currencyCode = convertMarketplaceIdentifier(
      data.countryCode,
    ).currencyCode;
    if (currencyCode !== 'EUR') {
      logMessage += `Currency conversion needed for currency code ${currencyCode}.`;
      // Implement currency conversion logic here if required
    }

    // Process fetched data for selling price calculation
    const {
      minimumSellingPrice: minimumSellingPriceLocalAndPanEu,
      maximumSellingPrice: maximumSellingPriceLocalAndPanEu,
    } = calculateSellingPrices(
      data.skuAcquisitionCostExc,
      data.minimumMarginAmount,
      data.closingFee,
      data.fbaFeeLocalAndPanEu,
      data.fbaFeeLowPriceLocalAndPanEu,
      data.lowPriceThresholdInc,
      data.vatRate,
      data.referralFeePercentage,
      data.reducedReferralFeePercentage,
      data.reducedReferralFeeLimit,
    );

    const {
      minimumSellingPrice: minimumSellingPriceEfn,
      maximumSellingPrice: maximumSellingPriceEfn,
    } = calculateSellingPrices(
      data.skuAcquisitionCostExc,
      data.minimumMarginAmount,
      data.closingFee,
      data.fbaFeeEfn,
      data.fbaFeeLowPriceEfn,
      data.lowPriceThresholdInc,
      data.vatRate,
      data.referralFeePercentage,
      data.reducedReferralFeePercentage,
      data.reducedReferralFeeLimit,
    );

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
