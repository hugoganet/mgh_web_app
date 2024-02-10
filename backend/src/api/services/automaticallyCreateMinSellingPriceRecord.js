const db = require('../models/index');
const { logger } = require('../../utils/logger');
const { getPriceGridFbaFeeId } = require('./getPriceGridFbaFeeId');
const eventBus = require('../../../src/utils/eventBus');

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
  const skuAcquisitionCostExc = skuRecord.skuAcquisitionCostExc;
  const countryCode = skuRecord.countryCode;

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
  console.log('referralFeeCategoryId: ', referralFeeCategoryId);

  const pricingRuleRecord = await db.PricingRule.findOne({
    where: { pricingRuleId: 1 },
  });
  if (!pricingRuleRecord) {
    logMessage += `No pricing rule record found for pricing rule ID 1, cannot create minimum selling price record.`;
    return;
  }
  const pricingRuleMinimumMarginAmount =
    pricingRuleRecord.pricingRuleMinimumMargin;
  const pricingRuleMinimumRoiPercentage =
    pricingRuleRecord.pricingRuleMinimumRoiPercentage;

  // if ( sku(aquisition_cost_exc) x pricing_rule(pricing_rule_minimum_roi) < pricing_rule(pricing_rule_minimum_margin) ) { pricing_rule(pricing_rule_minimum_margin) } else {  sku(aquisition_cost_exc) x pricing_rule(pricing_rule_minimum_roi) < pricing_rule(pricing_rule_minimum_margin) }
  const minimumMarginAmount = Math.max(
    skuAcquisitionCostExc * pricingRuleMinimumRoiPercentage,
    pricingRuleMinimumMarginAmount,
  );

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
  });
}

module.exports = { automaticallyCreateMinSellingPriceRecord };

automaticallyCreateMinSellingPriceRecord(1, true); // should return 8 as the referralFeeCategoryId
