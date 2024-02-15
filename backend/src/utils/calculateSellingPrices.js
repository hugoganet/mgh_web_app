const { logger } = require('../utils/logger');
const {
  fetchDataForSellingPriceCalculation,
} = require('../api/services/fetchDataForSellingPriceCalculation');
const {
  calculateCostBeforeReferralFeeAndCheckReducedFee,
} = require('./calculateCostBeforeReferralFeeAndCheckReducedFee');
const {
  calculateMinimumSellingPrice,
} = require('./calculateMinimumSellingPrice');
const {
  calculateMaximumSellingPrice,
} = require('./calculateMaximumSellingPrice');
const { parseAndValidateNumber } = require('./parseAndValidateNumber');

/**
 * @description Calculate the minimum and maximum selling prices for both EFN and Local/PanEU
 * @function calculateSellingPrices
 * @param {number} skuId - The ID of the SKU for which to calculate selling prices
 * @param {boolean} createLog - Whether to create a log for this operation
 * @param {string} logContext - The context for the log message
 * @return {Object} An object containing selling prices for EFN and Local/PanEU
 */
async function calculateSellingPrices(
  skuId,
  createLog = false,
  logContext = 'calculateSellingPrices',
) {
  try {
    const data = await fetchDataForSellingPriceCalculation(
      skuId,
      true,
      logContext,
    );

    const feeTypes = [
      {
        type: 'LocalAndPanEU',
        fbaFee: data.fbaFeeLocalAndPanEu,
        fbaFeeLowPrice: data.fbaFeeLowPriceLocalAndPanEu,
      },
      {
        type: 'EFN',
        fbaFee: data.fbaFeeEfn,
        fbaFeeLowPrice: data.fbaFeeLowPriceEfn,
      },
    ];
    const sellingPrices = {};

    for (const { type, fbaFee, fbaFeeLowPrice } of feeTypes) {
      let calculationResults;
      let minimumSellingPrice;
      let maximumSellingPrice;

      // Attempt calculation with LowPrice FBA Fee if conditions allow
      if (data.lowPriceThresholdInc !== null && fbaFeeLowPrice !== null) {
        calculationResults =
          await calculateCostBeforeReferralFeeAndCheckReducedFee(
            data.skuAcquisitionCostExc,
            data.minimumMarginAmount,
            data.closingFee,
            fbaFeeLowPrice,
            data.reducedReferralFeeLimit,
            data.vatRate,
            data.reducedReferralFeePercentage,
            data.referralFeePercentage,
            data.currencyCode,
          );

        minimumSellingPrice = calculateMinimumSellingPrice(
          calculationResults.costBeforeReferralFees,
          calculationResults.applicableReferralFeePercentage,
          data.vatRate,
        );

        if (minimumSellingPrice <= data.lowPriceThresholdInc) {
          maximumSellingPrice = calculateMaximumSellingPrice(
            calculationResults.reducedReferralFeeThresholdSellingPriceInc,
            data.lowPriceThresholdInc,
            minimumSellingPrice,
          );

          sellingPrices[type] = {
            minimumSellingPrice: parseAndValidateNumber(minimumSellingPrice, {
              decimals: 2,
            }),
            maximumSellingPrice: parseAndValidateNumber(maximumSellingPrice, {
              decimals: 2,
            }),
            currencyCode: data.currencyCode,
          };
          continue;
        }
      }

      // Proceed with standard FBA fee calculation
      calculationResults =
        await calculateCostBeforeReferralFeeAndCheckReducedFee(
          data.skuAcquisitionCostExc,
          data.minimumMarginAmount,
          data.closingFee,
          fbaFee,
          data.reducedReferralFeeLimit,
          data.vatRate,
          data.reducedReferralFeePercentage,
          data.referralFeePercentage,
          data.currencyCode,
        );

      minimumSellingPrice = calculateMinimumSellingPrice(
        calculationResults.costBeforeReferralFees,
        calculationResults.applicableReferralFeePercentage,
        data.vatRate,
      );

      maximumSellingPrice = calculateMaximumSellingPrice(
        calculationResults.reducedReferralFeeThresholdSellingPriceInc,
        null, // Ignored for standard fee calculation
        minimumSellingPrice,
      );

      sellingPrices[type] = {
        minimumSellingPrice: parseAndValidateNumber(minimumSellingPrice, {
          decimals: 2,
        }),
        maximumSellingPrice: parseAndValidateNumber(maximumSellingPrice, {
          decimals: 2,
        }),
        currencyCode: data.currencyCode,
      };
    }

    return sellingPrices;
  } catch (error) {
    logger(
      `Error in calculateSellingPrices for SKU ID ${skuId}: ${error}`,
      logContext,
    );
    console.log(error);
  }
}

module.exports = { calculateSellingPrices };
