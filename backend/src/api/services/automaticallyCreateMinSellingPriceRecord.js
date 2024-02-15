const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');
const {
  calculateSellingPrices,
} = require('../../utils/calculateSellingPrices');
const {
  parseAndValidateNumber,
} = require('../../utils/parseAndValidateNumber');
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
      data.skuRecord.countryCode,
    ).currencyCode;
    if (currencyCode !== 'EUR') {
      logMessage += `Currency conversion needed for currency code ${currencyCode}.`;
      // Implement currency conversion logic here if required
    }

    // Process fetched data for selling price calculation
    const {
      minimumSellingPriceLocalAndPanEu,
      maximumSellingPriceLocalAndPanEu,
      minimumSellingPriceEfn,
      maximumSellingPriceEfn,
    } = calculateSellingPrices(
      parseAndValidateNumber(data.skuRecord.skuAcquisitionCostExc, {
        paramName: 'skuAcquisitionCostExc',
        min: 0,
      }),
      parseAndValidateNumber(
        data.pricingRuleRecord.pricingRuleMinimumMarginAmount,
        {
          paramName: 'minimumMarginAmount',
          min: 0,
        },
      ),
      parseAndValidateNumber(data.amazonReferralFeeRecord.closingFee, {
        paramName: 'closingFee',
        min: 0,
      }),
      parseAndValidateNumber(data.priceGridFbaFeeRecord.fbaFeeLocalAndPanEu, {
        paramName: 'fbaFeeLocalAndPanEu',
        min: 0,
      }),
      data.priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu
        ? parseAndValidateNumber(
            data.priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu,
            { paramName: 'fbaFeeLowPriceLocalAndPanEu', min: 0 },
          )
        : null,
      data.priceGridFbaFeeRecord.lowPriceThresholdInc
        ? parseAndValidateNumber(
            data.priceGridFbaFeeRecord.lowPriceThresholdInc,
            { paramName: 'lowPriceThresholdInc', min: 0 },
          )
        : null,
      parseAndValidateNumber(data.vatRateRecord.vatRate, {
        paramName: 'vatRate',
        min: 0,
        max: 1,
      }),
      parseAndValidateNumber(
        data.amazonReferralFeeRecord.referralFeePercentage,
        { paramName: 'referralFeePercentage', min: 0, max: 1 },
      ),
      data.amazonReferralFeeRecord.reducedReferralFeePercentage
        ? parseAndValidateNumber(
            data.amazonReferralFeeRecord.reducedReferralFeePercentage,
            { paramName: 'reducedReferralFeePercentage', min: 0, max: 1 },
          )
        : null,
      data.amazonReferralFeeRecord.reducedReferralFeeLimit
        ? parseAndValidateNumber(
            data.amazonReferralFeeRecord.reducedReferralFeeLimit,
            { paramName: 'reducedReferralFeeLimit', min: 0 },
          )
        : null,
    );

    // Here you would continue with creating the minimum selling price record in the database

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
    logMessage += ` Error: ${error.message}`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { automaticallyCreateMinSellingPriceRecord };

// automaticallyCreateMinSellingPriceRecord(2, true); // Book Low-price
automaticallyCreateMinSellingPriceRecord(3635, true); // Low-price, reduced referral fee
