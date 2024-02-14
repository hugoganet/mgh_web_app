/* eslint-disable require-jsdoc */
const {
  checkReducedReferralFeeApplicability,
} = require('./checkReducedReferralFeeApplicability');
const {
  calculateMinimumSellingPrice,
} = require('./calculateMinimumSellingPrice');

function calculateMinimumSellingPrices(
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
  // Initialize variables
  let costBeforeReferralFees;
  let minimumSellingPrice;

  // 1- IF (lowPriceSellingPriceThresholdIncludingVAT !== null) Calculate Cost Before Referral Fees with LowPrice FBA Fee:
  if (
    lowPriceSellingPriceThresholdIncludingVAT !== null &&
    fbaFeeLowPrice !== null
  ) {
    costBeforeReferralFees =
      skuAcquisitionCostExcludingVAT +
      minimumMarginAmount +
      closingFee +
      fbaFeeLowPrice;
    // 2- Check for reduced referral fee applicability
    const {
      useReducedFee: useReducedReferralFeeLocalAndPanEu,
      applicablePercentage: applicableReferralFeePercentageLocalAndPanEu,
    } = checkReducedReferralFeeApplicability(
      costBeforeReferralFees,
      reducedReferralFeeLimit,
      vatRate,
      reducedReferralFeePercentage,
    );
    // 3- Calculate minimumSellingPrice
    minimumSellingPrice = calculateMinimumSellingPrice(
      costBeforeReferralFees,
      vatRate,
      referralFeePercentage,
      useReducedReferralFeeLocalAndPanEu
        ? applicableReferralFeePercentageLocalAndPanEu
        : null,
      lowPriceSellingPriceThresholdIncludingVAT,
    );
    if (minimumSellingPrice <= lowPriceSellingPriceThresholdIncludingVAT) {
      return minimumSellingPrice;
    } else {
      // Recalculate with Standard FBA Fee
      costBeforeReferralFees =
        skuAcquisitionCostExcludingVAT +
        minimumMarginAmount +
        closingFee +
        fbaFee;
      const {
        useReducedFee: useReducedReferralFeeLocalAndPanEu,
        applicablePercentage: applicableReferralFeePercentageLocalAndPanEu,
      } = checkReducedReferralFeeApplicability(
        costBeforeReferralFees,
        reducedReferralFeeLimit,
        vatRate,
        reducedReferralFeePercentage,
      );
      minimumSellingPrice = calculateMinimumSellingPrice(
        costBeforeReferralFees,
        vatRate,
        referralFeePercentage,
        useReducedReferralFeeLocalAndPanEu
          ? applicableReferralFeePercentageLocalAndPanEu
          : null,
        lowPriceSellingPriceThresholdIncludingVAT,
      );
      return minimumSellingPrice;
    }
  } else {
    // 1- Calculate Cost Before Referral Fees with Standard FBA Fee
    costBeforeReferralFees =
      skuAcquisitionCostExcludingVAT +
      minimumMarginAmount +
      closingFee +
      fbaFee;
    // 2- Check for reduced referral fee applicability
    const {
      useReducedFee: useReducedReferralFeeLocalAndPanEu,
      applicablePercentage: applicableReferralFeePercentageLocalAndPanEu,
    } = checkReducedReferralFeeApplicability(
      costBeforeReferralFees,
      reducedReferralFeeLimit,
      vatRate,
      reducedReferralFeePercentage,
    );
    // 3- Calculate minimumSellingPrice
    minimumSellingPrice = calculateMinimumSellingPrice(
      costBeforeReferralFees,
      vatRate,
      referralFeePercentage,
      useReducedReferralFeeLocalAndPanEu
        ? applicableReferralFeePercentageLocalAndPanEu
        : null,
      lowPriceSellingPriceThresholdIncludingVAT,
    );
    return minimumSellingPrice;
  }

  console.log(`Minimum Selling Price: ${minimumSellingPrice}`);
}

module.exports = { calculateMinimumSellingPrices };
