/**
 * @description Calculate the maximum selling price
 * @function calculateMaximumSellingPrice
 * @param {number} reducedReferralFeeLimit - The reduced referral fee limit
 * @param {number} lowPriceThresholdIncludingVAT - The low price selling price threshold including VAT
 * @param {number} minimumSellingPrice - The minimum selling price
 * @param {number} markupMultiplier - The markup multiplier
 * @return {number} maximumSellingPrice - The maximum selling price
 */
function calculateMaximumSellingPrice(
  reducedReferralFeeLimit,
  lowPriceThresholdIncludingVAT,
  minimumSellingPrice,
  markupMultiplier = 1.5,
) {
  let maximumSellingPrice;
  if (!reducedReferralFeeLimit && !lowPriceThresholdIncludingVAT) {
    maximumSellingPrice = minimumSellingPrice * markupMultiplier;
  } else if (!reducedReferralFeeLimit) {
    maximumSellingPrice = lowPriceThresholdIncludingVAT;
  } else if (!lowPriceThresholdIncludingVAT) {
    maximumSellingPrice = reducedReferralFeeLimit;
  } else {
    maximumSellingPrice = Math.min(
      reducedReferralFeeLimit,
      lowPriceThresholdIncludingVAT,
    );
  }
  return maximumSellingPrice;
}

module.exports = { calculateMaximumSellingPrice };
