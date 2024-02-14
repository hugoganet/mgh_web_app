/**
 * @description Check if reduced referral fee is applicable and return the applicable percentage
 * @function checkReducedReferralFeeApplicability
 * @param {number} cost - The cost before referral fees
 * @param {number} reducedReferralFeeLimit - The reduced referral fee limit
 * @param {number} vatRate - The VAT rate
 * @param {number} reducedReferralFeePercentage - The reduced referral fee percentage
 * @return {Object} An object with the following properties:
 */
function checkReducedReferralFeeApplicability(
  cost,
  reducedReferralFeeLimit,
  vatRate,
  reducedReferralFeePercentage,
) {
  const threshold =
    reducedReferralFeeLimit *
    (1 / (1 + vatRate) - reducedReferralFeePercentage);
  const useReducedFee = cost <= threshold;
  const applicablePercentage = useReducedFee
    ? reducedReferralFeePercentage
    : null; // Assume null means standard fee applies

  return {
    useReducedFee,
    applicablePercentage,
  };
}

module.exports = { checkReducedReferralFeeApplicability };

// // Test case
// // Input
// const input = {
//   cost: 6.99,
//   reducedReferralFeeLimit: 10,
//   vatRate: 0.2,
//   reducedReferralFeePercentage: 0.0824,
// };
// // Output
// const output = checkReducedReferralFeeApplicability(
//   input.cost,
//   input.reducedReferralFeeLimit,
//   input.vatRate,
//   input.reducedReferralFeePercentage,
// );
// console.log(output);
