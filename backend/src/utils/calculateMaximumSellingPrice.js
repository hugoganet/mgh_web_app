/**
 * @description Calculate the maximum selling price
 * @function calculateMaximumSellingPrice
 * @param {number} reducedReferralFeeLimit - The reduced referral fee limit
 * @param {number} lowPriceSellingPriceThresholdIncludingVAT - The low price selling price threshold including VAT
 * @param {number} minimumSellingPrice - The minimum selling price
 * @param {number} markupMultiplier - The markup multiplier
 * @return {number} maximumSellingPrice - The maximum selling price
 */
function calculateMaximumSellingPrice(
  reducedReferralFeeLimit,
  lowPriceSellingPriceThresholdIncludingVAT,
  minimumSellingPrice,
  markupMultiplier = 1.5,
) {
  let maximumSellingPrice;
  if (!reducedReferralFeeLimit && !lowPriceSellingPriceThresholdIncludingVAT) {
    maximumSellingPrice = minimumSellingPrice * markupMultiplier;
  } else if (!reducedReferralFeeLimit) {
    maximumSellingPrice = lowPriceSellingPriceThresholdIncludingVAT;
  } else if (!lowPriceSellingPriceThresholdIncludingVAT) {
    maximumSellingPrice = reducedReferralFeeLimit;
  } else {
    maximumSellingPrice = Math.min(
      reducedReferralFeeLimit,
      lowPriceSellingPriceThresholdIncludingVAT,
    );
  }
  return maximumSellingPrice;
}

module.exports = { calculateMaximumSellingPrice };
