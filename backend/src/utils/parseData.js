const { parseAndValidateNumber } = require('./parseAndValidateNumber');

/**
 * Parses and validates the necessary fields for selling price calculation.
 * @param {Object} skuRecord - The SKU record.
 * @param {Object} pricingRuleRecord - The pricing rule record.
 * @param {Object} amazonReferralFeeRecord - The Amazon referral fee record.
 * @param {Object} priceGridFbaFeeRecord - The price grid FBA fee record.
 * @param {Object} vatRateRecord - The VAT rate record.
 * @param {Object} asinRecord - The ASIN record.
 * @param {string} currencyCode - The currency code.
 * @return {Object} The parsed and validated data.
 */
function parseData(
  skuRecord,
  pricingRuleRecord,
  amazonReferralFeeRecord,
  priceGridFbaFeeRecord,
  vatRateRecord,
  asinRecord,
  currencyCode,
) {
  // Ensure the minimumMarginAmount is rounded to two decimal places
  const minimumMarginAmount = Math.max(
    parseAndValidateNumber(skuRecord.skuAcquisitionCostExc, {
      paramName: 'skuAcquisitionCostExc',
      min: 0,
      decimals: 2,
    }) *
      parseAndValidateNumber(
        pricingRuleRecord.pricingRuleMinimumRoiPercentage,
        {
          paramName: 'pricingRuleMinimumRoiPercentage',
          min: 0,
          max: 1,
          decimals: 2,
        },
      ),
    parseAndValidateNumber(pricingRuleRecord.pricingRuleMinimumMarginAmount, {
      paramName: 'pricingRuleMinimumMarginAmount',
      min: 0,
      decimals: 2,
    }),
  );

  const factor = Math.pow(10, 2);
  const roundedMinimumMarginAmount =
    Math.round(minimumMarginAmount * factor) / factor;

  return {
    skuAcquisitionCostExc: parseAndValidateNumber(
      skuRecord.skuAcquisitionCostExc,
      { paramName: 'skuAcquisitionCostExc', min: 0, decimals: 2 },
    ),
    minimumMarginAmount: roundedMinimumMarginAmount,
    closingFee: parseAndValidateNumber(amazonReferralFeeRecord?.closingFee, {
      paramName: 'closingFee',
      min: 0,
      decimals: 2,
    }),
    fbaFeeLocalAndPanEu: parseAndValidateNumber(
      priceGridFbaFeeRecord?.fbaFeeLocalAndPanEu || 0,
      { paramName: 'fbaFeeLocalAndPanEu', min: 0, decimals: 2 },
    ),
    fbaFeeLowPriceLocalAndPanEu: parseAndValidateNumber(
      priceGridFbaFeeRecord?.fbaFeeLowPriceLocalAndPanEu || 0,
      { paramName: 'fbaFeeLowPriceLocalAndPanEu', min: 0, decimals: 2 },
    ),
    fbaFeeEfn: parseAndValidateNumber(priceGridFbaFeeRecord?.fbaFeeEfn || 0, {
      paramName: 'fbaFeeEfn',
      min: 0,
      decimals: 2,
    }),
    fbaFeeLowPriceEfn: parseAndValidateNumber(
      priceGridFbaFeeRecord?.fbaFeeLowPriceEfn || 0,
      { paramName: 'fbaFeeLowPriceEfn', min: 0, decimals: 2 },
    ),
    lowPriceThresholdInc: parseAndValidateNumber(
      priceGridFbaFeeRecord?.lowPriceThresholdInc || 0,
      { paramName: 'lowPriceThresholdInc', min: 0, decimals: 2 },
    ),
    vatRate: parseAndValidateNumber(vatRateRecord?.vatRate, {
      paramName: 'vatRate',
      min: 0,
      max: 1,
    }),
    referralFeePercentage: parseAndValidateNumber(
      amazonReferralFeeRecord?.referralFeePercentage,
      {
        paramName: 'referralFeePercentage',
        min: 0,
        max: 1,
      },
    ),
    reducedReferralFeePercentage: parseAndValidateNumber(
      amazonReferralFeeRecord?.reducedReferralFeePercentage || 0,
      {
        paramName: 'reducedReferralFeePercentage',
        min: 0,
        max: 1,
      },
    ),
    reducedReferralFeeLimit: parseAndValidateNumber(
      amazonReferralFeeRecord?.reducedReferralFeeLimit || 0,
      {
        paramName: 'reducedReferralFeeLimit',
        min: 0,
        decimals: 2,
      },
    ),
    referralFeeCategoryId: amazonReferralFeeRecord?.referralFeeCategoryId,
    isHazmat: asinRecord?.isHazmat,
    countryCode: skuRecord?.countryCode,
    currencyCode,
  };
}

module.exports = { parseData };
