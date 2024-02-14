/**
 * @description Calculate the minimum selling price for a product
 * @function calculateMinimumSellingPrice
 * @param {number} costBeforeReferralFees - The cost before referral fees
 * @param {number} vatRate - The VAT rate
 * @param {number} referralFeePercentage - The referral fee percentage
 * @param {number} reducedReferralFeePercentage - The reduced referral fee percentage
 * @param {number} lowPriceSellingPriceThresholdInc - The low price selling price threshold
 * @return {number} The minimum selling price
 */
function calculateMinimumSellingPrice(
  costBeforeReferralFees,
  vatRate,
  referralFeePercentage,
  reducedReferralFeePercentage = null,
  lowPriceSellingPriceThresholdInc = null,
) {
  let applicableReferralFeePercentage = referralFeePercentage;

  if (reducedReferralFeePercentage !== null) {
    applicableReferralFeePercentage = reducedReferralFeePercentage;
  }

  let minimumSellingPrice =
    costBeforeReferralFees / (1 - applicableReferralFeePercentage - vatRate);

  if (
    lowPriceSellingPriceThresholdInc !== null &&
    minimumSellingPrice > lowPriceSellingPriceThresholdInc
  ) {
    applicableReferralFeePercentage = referralFeePercentage; // Revert to standard referral fee if over threshold
    minimumSellingPrice =
      costBeforeReferralFees / (1 - applicableReferralFeePercentage - vatRate);
  }

  return minimumSellingPrice.toFixed(2);
}

module.exports = { calculateMinimumSellingPrice };
