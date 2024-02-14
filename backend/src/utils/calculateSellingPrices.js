/* eslint-disable require-jsdoc */
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
 * @description Calculate the minimum and maximum selling prices
 * @function calculateSellingPrices
 * @param {number} skuAcquisitionCostExcludingVAT - The SKU acquisition cost excluding VAT
 * @param {number} minimumMarginAmount - The minimum margin amount
 * @param {number} closingFee - The closing fee
 * @param {number} fbaFee - The FBA fee
 * @param {number} fbaFeeLowPrice - The low price FBA fee
 * @param {number} lowPriceSellingPriceThresholdIncludingVAT - The low price selling price threshold including VAT
 * @param {number} vatRate - The VAT rate
 * @param {number} referralFeePercentage - The referral fee percentage
 * @param {number} reducedReferralFeePercentage - The reduced referral fee percentage
 * @param {number} reducedReferralFeeLimit - The reduced referral fee limit
 * @return {Object} An object with the following properties:
 * @return {number} minimumSellingPrice - The minimum selling price
 * @return {number} maximumSellingPrice - The maximum selling price
 */
function calculateSellingPrices(
  skuAcquisitionCostExcludingVAT,
  minimumMarginAmount,
  closingFee,
  fbaFee,
  fbaFeeLowPrice,
  lowPriceSellingPriceThresholdIncludingVAT,
  vatRate,
  referralFeePercentage,
  reducedReferralFeePercentage = null,
  reducedReferralFeeLimit = null,
) {
  let minimumSellingPrice;
  let maximumSellingPrice;

  // First, attempt calculation with LowPrice FBA Fee if conditions allow
  if (
    lowPriceSellingPriceThresholdIncludingVAT !== null &&
    fbaFeeLowPrice !== null
  ) {
    const {
      costBeforeReferralFees,
      applicableReferralFeePercentage,
      reducedReferralFeeThresholdSellingPriceInc,
    } = calculateCostBeforeReferralFeeAndCheckReducedFee(
      skuAcquisitionCostExcludingVAT,
      minimumMarginAmount,
      closingFee,
      fbaFeeLowPrice,
      reducedReferralFeeLimit,
      vatRate,
      reducedReferralFeePercentage,
      referralFeePercentage,
    );

    minimumSellingPrice = parseAndValidateNumber(
      calculateMinimumSellingPrice(
        costBeforeReferralFees,
        applicableReferralFeePercentage,
        vatRate,
      ),
      {
        paramName: 'minimumSellingPrice',
      },
    );

    // Return if within threshold, else proceed to calculate with standard FBA fee
    if (minimumSellingPrice <= lowPriceSellingPriceThresholdIncludingVAT) {
      maximumSellingPrice = parseAndValidateNumber(
        calculateMaximumSellingPrice(
          reducedReferralFeeThresholdSellingPriceInc,
          lowPriceSellingPriceThresholdIncludingVAT,
          minimumSellingPrice,
        ),
        {
          paramName: 'maximumSellingPrice',
          min: minimumSellingPrice,
        },
      );
      return (sellingPrices = {
        minimumSellingPrice,
        maximumSellingPrice,
      });
    }
  }
  // Calculate with Standard FBA Fee
  lowPriceSellingPriceThresholdIncludingVAT = null; // set this to null for calculateMaximumSellingPrice

  const {
    costBeforeReferralFees,
    applicableReferralFeePercentage,
    reducedReferralFeeThresholdSellingPriceInc,
  } = calculateCostBeforeReferralFeeAndCheckReducedFee(
    skuAcquisitionCostExcludingVAT,
    minimumMarginAmount,
    closingFee,
    fbaFee,
    reducedReferralFeeLimit,
    vatRate,
    reducedReferralFeePercentage,
    referralFeePercentage,
  );

  minimumSellingPrice = parseAndValidateNumber(
    calculateMinimumSellingPrice(
      costBeforeReferralFees,
      applicableReferralFeePercentage,
      vatRate,
    ),
    {
      paramName: 'minimumSellingPrice',
      min: 0,
    },
  );
  // calculate maximumSellingPrice
  maximumSellingPrice = parseAndValidateNumber(
    calculateMaximumSellingPrice(
      reducedReferralFeeThresholdSellingPriceInc,
      lowPriceSellingPriceThresholdIncludingVAT,
      minimumSellingPrice,
    ),
    {
      paramName: 'maximumSellingPrice',
      min: minimumSellingPrice,
    },
  );

  return (sellingPrices = {
    minimumSellingPrice,
    maximumSellingPrice,
  });
}

module.exports = { calculateSellingPrices };
