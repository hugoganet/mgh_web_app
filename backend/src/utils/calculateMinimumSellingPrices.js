const {
  checkReducedReferralFeeApplicability,
} = require('./checkReducedReferralFeeApplicability');
const {
  calculateMinimumSellingPrice,
} = require('./calculateMinimumSellingPrice');

/* eslint-disable require-jsdoc */
function calculateMinimumSellingPrices(
  skuAcquisitionCostExcludingVAT,
  minimumMarginAmount,
  closingFee,
  fbaFeeLocalAndPanEuropean,
  fbaFeeLowPriceLocalAndPanEuropean,
  fbaFeeEuropeanFulfillmentNetwork,
  fbaFeeLowPriceEuropeanFulfillmentNetwork,
  lowPriceSellingPriceThresholdIncludingVAT,
  vatRate,
  referralFeePercentage,
  reducedReferralFeePercentage = null,
  reducedReferralFeeLimit = null,
) {
  // Calculate cost before VAT and referral fees for Standard and Low-Price parcels for Local/Pan-EU
  const costBeforeReferralFeesLocalAndPanEuropean =
    skuAcquisitionCostExcludingVAT +
    minimumMarginAmount +
    closingFee +
    fbaFeeLocalAndPanEuropean;

  const costBeforeReferralFeesLowPriceLocalAndPanEuropean =
    lowPriceSellingPriceThresholdIncludingVAT !== null &&
    fbaFeeLowPriceLocalAndPanEuropean !== null
      ? skuAcquisitionCostExcludingVAT +
        minimumMarginAmount +
        closingFee +
        fbaFeeLowPriceLocalAndPanEuropean
      : null;

  // Calculate cost before VAT and referral fees for Standard and Low-Price parcels for EFN
  const costBeforeReferralFeesEFN =
    skuAcquisitionCostExcludingVAT +
    minimumMarginAmount +
    closingFee +
    fbaFeeEuropeanFulfillmentNetwork;

  const costBeforeReferralFeesLowPriceEuropeanFulfillmentNetwork =
    lowPriceSellingPriceThresholdIncludingVAT !== null &&
    fbaFeeLowPriceEuropeanFulfillmentNetwork !== null
      ? skuAcquisitionCostExcludingVAT +
        minimumMarginAmount +
        closingFee +
        fbaFeeLowPriceEuropeanFulfillmentNetwork
      : null;

  // Check for reduced referral fee applicability
  const {
    useReducedFee: useReducedReferralFeeLocalAndPanEu,
    applicablePercentage: applicableReferralFeePercentageLocalAndPanEu,
  } = checkReducedReferralFeeApplicability(
    costBeforeReferralFeesLocalAndPanEuropean,
    reducedReferralFeeLimit,
    vatRate,
    reducedReferralFeePercentage,
  );

  const {
    useReducedFee: useReducedReferralFeeEfn,
    applicablePercentage: applicableReferralFeePercentageEfn,
  } = checkReducedReferralFeeApplicability(
    costBeforeReferralFeesEFN,
    reducedReferralFeeLimit,
    vatRate,
    reducedReferralFeePercentage,
  );

  // Calculate minimum selling price for Local and Pan-EU
  const minimumSellingPriceLocalAndPanEuropean = calculateMinimumSellingPrice(
    costBeforeReferralFeesLocalAndPanEuropean,
    vatRate,
    referralFeePercentage,
    useReducedReferralFeeLocalAndPanEu
      ? applicableReferralFeePercentageLocalAndPanEu
      : null,
    lowPriceSellingPriceThresholdIncludingVAT,
  );

  // Calculate minimum selling price for EFN
  const minimumSellingPriceEuropeanFulfillmentNetwork =
    calculateMinimumSellingPrice(
      costBeforeReferralFeesEFN,
      vatRate,
      referralFeePercentage,
      useReducedReferralFeeEfn ? applicableReferralFeePercentageEfn : null,
      lowPriceSellingPriceThresholdIncludingVAT,
    );

  // Log for verification, remove in production
  console.log(
    `Minimum Selling Price Local/Pan-EU: ${minimumSellingPriceLocalAndPanEuropean}`,
  );
  console.log(
    `Minimum Selling Price EFN: ${minimumSellingPriceEuropeanFulfillmentNetwork}`,
  );

  // Return calculated prices
  return {
    minimumSellingPriceLocalAndPanEuropean,
    minimumSellingPriceEuropeanFulfillmentNetwork,
  };
}

module.exports = { calculateMinimumSellingPrices };
