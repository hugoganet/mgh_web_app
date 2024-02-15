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
      createLog,
      logContext,
    );
    console.log(JSON.stringify(data, '', 2));
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

    feeTypes.forEach(({ type, fbaFee, fbaFeeLowPrice }) => {
      let calculationResults;
      let minimumSellingPrice;
      let maximumSellingPrice;

      // Attempt calculation with LowPrice FBA Fee if conditions allow
      if (data.lowPriceThresholdInc !== null && fbaFeeLowPrice !== null) {
        console.log('lowPriceThresholdInc:', data.lowPriceThresholdInc);
        calculationResults = calculateCostBeforeReferralFeeAndCheckReducedFee(
          data.skuAcquisitionCostExc,
          data.minimumMarginAmount,
          data.closingFee,
          fbaFeeLowPrice,
          data.reducedReferralFeeLimit,
          data.vatRate,
          data.reducedReferralFeePercentage,
          data.referralFeePercentage,
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
          // If within the low price threshold, assign the calculated prices
          sellingPrices[type] = {
            minimumSellingPrice: parseAndValidateNumber(minimumSellingPrice, {
              paramName: 'minimumSellingPrice',
              min: 0,
              decimals: 2,
            }),
            maximumSellingPrice: parseAndValidateNumber(maximumSellingPrice, {
              paramName: 'maximumSellingPrice',
              min: minimumSellingPrice,
              decimals: 2,
            }),
          };
          return;
        }
      }
      // Proceed to calculate with standard FBA fee if low price conditions not met or not applicable
      calculationResults = calculateCostBeforeReferralFeeAndCheckReducedFee(
        data.skuAcquisitionCostExc,
        data.minimumMarginAmount,
        data.closingFee,
        fbaFee,
        data.reducedReferralFeeLimit,
        data.vatRate,
        data.reducedReferralFeePercentage,
        data.referralFeePercentage,
      );

      minimumSellingPrice = calculateMinimumSellingPrice(
        calculationResults.costBeforeReferralFees,
        calculationResults.applicableReferralFeePercentage,
        data.vatRate,
      );

      maximumSellingPrice = calculateMaximumSellingPrice(
        calculationResults.reducedReferralFeeThresholdSellingPriceInc,
        (lowPriceThresholdInc = null), // If low price threshold not met, or low price conditions not applicable, set lowPriceThresholdInc to null
        minimumSellingPrice,
      );

      // Assign the calculated prices
      sellingPrices[type] = {
        minimumSellingPrice: parseAndValidateNumber(minimumSellingPrice, {
          paramName: 'minimumSellingPrice',
          min: 0,
          decimals: 2,
        }),
        maximumSellingPrice: parseAndValidateNumber(maximumSellingPrice, {
          paramName: 'maximumSellingPrice',
          min: minimumSellingPrice,
          decimals: 2,
        }),
      };
    });

    return sellingPrices;
  } catch (error) {
    logger(
      `Error in calculateSellingPrices for SKU ID ${skuId}: ${error}`,
      logContext,
    );
    throw error;
  }
}

module.exports = { calculateSellingPrices };
