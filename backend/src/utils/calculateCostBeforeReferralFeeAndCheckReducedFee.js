const { parseAndValidateNumber } = require('./parseAndValidateNumber');

/**
 * @description Check if reduced referral fee is applicable and return the applicable percentage
 * @function calculateCostBeforeReferralFeeAndCheckReducedFee
 * @param {number} skuAcquisitionCostExc - The SKU acquisition cost excluding VAT
 * @param {number} minimumMarginAmount - The minimum margin amount
 * @param {number} closingFee - The closing fee
 * @param {number} fbaFee - The FBA fee
 * @param {number} reducedReferralFeeLimit - The reduced referral fee limit
 * @param {number} vatRate - The VAT rate
 * @param {number} reducedReferralFeePercentage - The reduced referral fee percentage
 * @param {number} referralFeePercentage - The referral fee percentage
 * @return {Object} An object with the following properties:
 * @return {number} costBeforeReferralFees - The cost before referral fees
 * @return {number} applicableReferralFeePercentage - The applicable referral fee percentage
 */
function calculateCostBeforeReferralFeeAndCheckReducedFee(
  skuAcquisitionCostExc,
  minimumMarginAmount,
  closingFee,
  fbaFee,
  reducedReferralFeeLimit,
  vatRate,
  reducedReferralFeePercentage,
  referralFeePercentage,
) {
  const costBeforeReferralFees = parseAndValidateNumber(
    skuAcquisitionCostExc + minimumMarginAmount + closingFee + fbaFee,
    {
      paramName: 'costBeforeReferralFees',
      min: 0,
    },
  );
  const threshold =
    reducedReferralFeeLimit *
    (1 / (1 + vatRate) - reducedReferralFeePercentage);
  const useReducedFee = costBeforeReferralFees <= threshold;
  const applicablePercentage = useReducedFee
    ? parseAndValidateNumber(reducedReferralFeePercentage, {
        paramName: 'reducedReferralFeePercentage',
        min: 0,
        max: 1,
      })
    : parseAndValidateNumber(referralFeePercentage, {
        paramName: 'referralFeePercentage',
        min: 0,
        max: 1,
      });

  return {
    costBeforeReferralFees,
    applicableReferralFeePercentage: applicablePercentage,
    reducedReferralFeeThresholdSellingPriceInc: useReducedFee
      ? parseAndValidateNumber(reducedReferralFeeLimit, {
          paramName: 'reducedReferralFeeThresholdSellingPriceInc',
          min: 0,
        })
      : null,
  };
}

module.exports = { calculateCostBeforeReferralFeeAndCheckReducedFee };
