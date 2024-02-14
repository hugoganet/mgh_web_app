/* eslint-disable require-jsdoc */
const {
  calculateCostBeforeReferralFeeAndCheckReducedFee,
} = require('./calculateCostBeforeReferralFeeAndCheckReducedFee');

/**
 * @description Calculate the minimum selling price for a SKU
 * @function calculateMinimumSellingPrice
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
 * @return {number} minimumSellingPrice - The minimum selling price
 */
function calculateMinimumSellingPrice(
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
  // First, attempt calculation with LowPrice FBA Fee if conditions allow
  if (
    lowPriceSellingPriceThresholdIncludingVAT !== null &&
    fbaFeeLowPrice !== null
  ) {
    const { costBeforeReferralFees, applicableReferralFeePercentage } =
      calculateCostBeforeReferralFeeAndCheckReducedFee(
        skuAcquisitionCostExcludingVAT,
        minimumMarginAmount,
        closingFee,
        fbaFeeLowPrice,
        reducedReferralFeeLimit,
        vatRate,
        reducedReferralFeePercentage,
      );

    const minimumSellingPrice =
      costBeforeReferralFees /
      (1 -
        (applicableReferralFeePercentage || referralFeePercentage) -
        vatRate);

    // Return if within threshold, else proceed to calculate with standard FBA fee
    if (minimumSellingPrice <= lowPriceSellingPriceThresholdIncludingVAT) {
      return minimumSellingPrice.toFixed(2);
    }
  }

  // Calculate with Standard FBA Fee
  const { costBeforeReferralFees, applicableReferralFeePercentage } =
    calculateCostBeforeReferralFeeAndCheckReducedFee(
      skuAcquisitionCostExcludingVAT,
      minimumMarginAmount,
      closingFee,
      fbaFee,
      reducedReferralFeeLimit,
      vatRate,
      reducedReferralFeePercentage,
    );

  return (
    costBeforeReferralFees /
    (
      1 -
      (applicableReferralFeePercentage || referralFeePercentage) -
      vatRate
    ).toFixed(2)
  );
}

module.exports = { calculateMinimumSellingPrice };
