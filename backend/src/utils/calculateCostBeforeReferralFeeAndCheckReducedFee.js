/**
 * @description Check if reduced referral fee is applicable and return the applicable percentage
 * @function calculateCostBeforeReferralFeeAndCheckReducedFee
 * @param {number} skuAcquisitionCostExcludingVAT - The SKU acquisition cost excluding VAT
 * @param {number} minimumMarginAmount - The minimum margin amount
 * @param {number} closingFee - The closing fee
 * @param {number} fbaFee - The FBA fee
 * @param {number} reducedReferralFeeLimit - The reduced referral fee limit
 * @param {number} vatRate - The VAT rate
 * @param {number} reducedReferralFeePercentage - The reduced referral fee percentage
 * @return {Object} An object with the following properties:
 * @return {number} costBeforeReferralFees - The cost before referral fees
 * @return {number} applicableReferralFeePercentage - The applicable referral fee percentage
 */
function calculateCostBeforeReferralFeeAndCheckReducedFee(
  skuAcquisitionCostExcludingVAT,
  minimumMarginAmount,
  closingFee,
  fbaFee,
  reducedReferralFeeLimit,
  vatRate,
  reducedReferralFeePercentage,
) {
  const costBeforeReferralFees =
    skuAcquisitionCostExcludingVAT + minimumMarginAmount + closingFee + fbaFee;

  const threshold =
    reducedReferralFeeLimit *
    (1 / (1 + vatRate) - reducedReferralFeePercentage);
  const useReducedFee = costBeforeReferralFees <= threshold;
  const applicablePercentage = useReducedFee
    ? reducedReferralFeePercentage
    : null; // Assume null means standard fee applies

  return {
    costBeforeReferralFees,
    applicableReferralFeePercentage: useReducedFee
      ? applicablePercentage
      : null,
    reducedReferralFeeLimit: useReducedFee ? reducedReferralFeeLimit : null,
  };
}

module.exports = { calculateCostBeforeReferralFeeAndCheckReducedFee };
