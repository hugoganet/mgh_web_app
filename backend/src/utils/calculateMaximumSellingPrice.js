// To calculate the maximumSellingPrice, I need to know if we are using a reducedReferralFee, and what is the threshold.
// I also need to know if we are using lowPriceFbaFee, and what is the threshold.
// I should transform calculateMinimumSellingPrice into calculateSellingPrice

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
  // Basic error handling for input validation
  if (typeof minimumSellingPrice !== 'number' || minimumSellingPrice <= 0) {
    throw new Error('Invalid minimumSellingPrice: must be a positive number.');
  }
  if (markupMultiplier < 0) {
    throw new Error(
      'Invalid markupMultiplier: must be greater than or = to 0.',
    );
  }

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

  console.log('Calculated maximumSellingPrice:', maximumSellingPrice);
  return maximumSellingPrice;
}

module.exports = { calculateMaximumSellingPrice };
