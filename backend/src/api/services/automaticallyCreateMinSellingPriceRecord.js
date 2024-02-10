const db = require('../models/index');
const { logger } = require('../../utils/logger');
const { getPriceGridFbaFeeId } = require('./getPriceGridFbaFeeId');
const eventBus = require('../../utils/eventBus');
const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');

/**
 * @description This function creates a minimum selling price record in the database if it does not exist.
 * @function automaticallyCreateMinSellingPriceRecord
 * @param {number} skuId - The ID of the SKU for which to create a minimum selling price record.
 * @param {boolean} createLog - Whether to create a log for this operation.
 * @param {string} logContext - The context for the log message.
 */
async function automaticallyCreateMinSellingPriceRecord(
  skuId,
  createLog = false,
  logContext = 'automaticallyCreateMinSellingPriceRecord',
) {
  let logMessage = '';
  const skuRecord = await db.Sku.findOne({
    where: { skuId },
  });

  if (!skuRecord) {
    logMessage += `No SKU record found for SKU ID ${skuId}.`;
    return;
  }
  const countryCode = skuRecord.countryCode;

  const { currencyCode } = convertMarketplaceIdentifier(countryCode);

  const asinRecord = await db.Asin.findOne({
    include: [
      {
        model: db.Sku,
        where: { skuId },
        required: true,
      },
    ],
  });

  if (!asinRecord) {
    logMessage = `No ASIN record found for SKU ID ${skuId}. productCategoryId needed to create minimum selling price record.`;
    return;
  }
  const productCategoryId = asinRecord.productCategoryId;

  const amazonReferralFeeRecord = await db.AmazonReferralFee.findOne({
    include: [
      {
        model: db.ProductCategory,
        through: {
          model: db.ProductAndAmzReferralFeeCategory,
          where: { productCategoryId: productCategoryId },
        },
        required: true,
      },
    ],
    where: { countryCode: countryCode },
  });
  if (!amazonReferralFeeRecord) {
    logMessage += `No referral fee record found for product category ID ${productCategoryId} and country code ${countryCode}.`;
    return;
  }
  const referralFeeCategoryId = amazonReferralFeeRecord.referralFeeCategoryId;
  const closingFee = amazonReferralFeeRecord.closingFee;
  const reducedReferralFeePercentage =
    amazonReferralFeeRecord.reducedReferralFeePercentage;

  const fbaFeeRecord = await db.fbaFee.findOne({
    where: { asinId: asinRecord.asinId },
  });
  if (!fbaFeeRecord) {
    logMessage += `No FBA fee record found for ASIN ID ${asinRecord.asinId}.`;
    return;
  }
  priceGridFbaFeeRecord = await db.PriceGridFbaFee.findOne({
    where: { priceGridFbaFeeId: fbaFeeRecord.priceGridFbaFeeId },
  });
  if (!priceGridFbaFeeRecord) {
    logMessage += `No price grid FBA fee record found for price grid FBA fee ID ${fbaFeeRecord.priceGridFbaFeeId}.`;
    return;
  }

  const pricingRuleRecord = await db.PricingRule.findOne({
    where: { pricingRuleId: 1 },
  });
  if (!pricingRuleRecord) {
    logMessage += `No pricing rule record found for pricing rule ID 1, cannot create minimum selling price record.`;
    return;
  }

  const productTaxCategoryId = asinRecord.productTaxCategoryId;
  const vatCategoryId =
    await db.ProductTaxCategory.findByPk(productTaxCategoryId).vatCategoryId;
  const { vatRate } = await db.VatRatePerCountry.findOne({
    where: {
      countryCode,
      vatCategoryId,
    },
  });

  const referralFeePercentage = amazonReferralFeeRecord.referralFeePercentage;

  // ! From here on, I'll have to add the converting logic for currencyCode !== 'EUR
  let skuAcquisitionCostExc;
  if (currencyCode === 'EUR') {
    skuAcquisitionCostExc = skuRecord.skuAcquisitionCostExc;
  } else {
    logMessage += `Cannot create minimum selling price record for SKU ID ${skuId} because the currency code ${currencyCode} is not supported.`;
    return;
  }
  const fbaFeeLocalAndPanEu = priceGridFbaFeeRecord.fbaFeeLocalAndPanEu;
  const fbaFeeEfn = priceGridFbaFeeRecord.fbaFeeEfn;

  const minimumMarginAmount = Math.max(
    skuAcquisitionCostExc * pricingRuleRecord.pricingRuleMinimumRoiPercentage,
    pricingRuleRecord.pricingRuleMinimumMarginAmount,
  );

  const minimumSellingPriceLocalAndPanEu =
    (skuAcquisitionCostExc +
      minimumMarginAmount +
      closingFee +
      fbaFeeLocalAndPanEu) /
    (1 / (1 + vatRate) - referralFeePercentage);

  const minimumSellingPriceEfn =
    (skuAcquisitionCostExc + minimumMarginAmount + closingFee + fbaFeeEfn) /
    (1 / (1 + vatRate) - referralFeePercentage);

  const minimumSellingPriceRecord = await db.MinimumSellingPrice.create({
    skuId,
    pricingRuleId: 1,
    enrolledInPanEu: false,
    eligibleForPanEu: false,
    referralFeeCategoryId,
    minimumMarginAmount,
    minimumSellingPriceLocalAndPanEu,
    minimumSellingPriceEfn,
    maximumSellingPriceLocalAndPanEu,
    maximumSellingPriceEfn,
    currencyCode,
  });

  console.log('referralFeeCategoryId: ', referralFeeCategoryId);
  console.log('minimumMarginAmount: ', minimumMarginAmount);
  console.log('currencyCode: ', currencyCode);
}

module.exports = { automaticallyCreateMinSellingPriceRecord };

automaticallyCreateMinSellingPriceRecord(1, true); // should return 8 as the referralFeeCategoryId
