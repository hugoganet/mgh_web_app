const { parseAndValidateNumber } = require('./parseAndValidateNumber');

/**
 * @description Calculates the minimum selling price for a product considering cost before referral fees, applicable referral fee percentage, and VAT rate.
 * @function calculateMinimumSellingPrice
 * @param {number} costBeforeReferralFees - The cost before referral fees.
 * @param {number} applicableReferralFeePercentage - The applicable referral fee percentage.
 * @param {number} vatRate - The VAT rate.
 * @return {number} The calculated minimum selling price, rounded to two decimal places.
 * @throws {Error} If input parameters are not numbers or are out of valid range.
 */
function calculateMinimumSellingPrice(
  costBeforeReferralFees,
  applicableReferralFeePercentage,
  vatRate,
) {
  // Validate input parameters
  if (
    typeof costBeforeReferralFees !== 'number' ||
    costBeforeReferralFees <= 0
  ) {
    throw new Error(
      'Invalid costBeforeReferralFees: must be a positive number.',
    );
  }
  if (
    typeof applicableReferralFeePercentage !== 'number' ||
    applicableReferralFeePercentage < 0 ||
    applicableReferralFeePercentage >= 1
  ) {
    throw new Error(
      'Invalid applicableReferralFeePercentage: must be a number between 0 and 1.',
    );
  }
  if (typeof vatRate !== 'number' || vatRate < 0 || vatRate >= 1) {
    throw new Error('Invalid vatRate: must be a number between 0 and 1.');
  }

  // Calculate minimum selling price
  const minimumSellingPrice = parseAndValidateNumber(
    costBeforeReferralFees / (1 - applicableReferralFeePercentage - vatRate),
    {
      paramName: 'minimumSellingPrice',
      min: 0,
    },
  );
  return minimumSellingPrice;
}

module.exports = { calculateMinimumSellingPrice };
