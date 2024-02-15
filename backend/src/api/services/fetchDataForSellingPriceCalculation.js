const db = require('../models/index');
const { logger } = require('../../utils/logger');

/**
 * Fetches necessary data for calculating selling prices.
 * @param {number} skuId - The ID of the SKU for which to fetch data.
 * @param {boolean} createLog - Whether to create a log for this operation.
 * @param {string} logContext - The context for the log message.
 * @return {Object} An object containing fetched data.
 */
async function fetchDataForSellingPriceCalculation(
  skuId,
  createLog = false,
  logContext = 'fetchDataForSellingPriceCalculation',
) {
  const data = {};

  // Fetch SKU record
  data.skuRecord = await db.Sku.findOne({
    where: { skuId },
  });
  if (!data.skuRecord)
    throw new Error(`No SKU record found for SKU ID ${skuId}.`);

  // Fetch ASIN record
  data.asinRecord = await db.Asin.findOne({
    include: [
      {
        model: db.Sku,
        where: { skuId },
        required: true,
      },
    ],
  });
  if (!data.asinRecord)
    throw new Error(`No ASIN record found for SKU ID ${skuId}.`);

  // Fetch AmazonReferralFee record
  data.amazonReferralFeeRecord = await db.AmazonReferralFee.findOne({
    include: [
      {
        model: db.ProductCategory,
        through: {
          model: db.ProductAndAmzReferralFeeCategory,
          where: { productCategoryId: data.asinRecord.productCategoryId },
        },
        required: true,
      },
    ],
    where: { countryCode: data.skuRecord.countryCode },
  });
  if (!data.amazonReferralFeeRecord)
    throw new Error(
      `No referral fee record found for product category ID ${data.asinRecord.productCategoryId} and country code ${data.skuRecord.countryCode}.`,
    );

  // Fetch FbaFee record
  data.fbaFeeRecord = await db.FbaFee.findOne({
    where: { asinId: data.asinRecord.asinId },
  });
  if (!data.fbaFeeRecord)
    throw new Error(
      `No FBA fee record found for ASIN ID ${data.asinRecord.asinId}.`,
    );

  // Fetch PriceGridFbaFee record
  data.priceGridFbaFeeRecord = await db.PriceGridFbaFee.findOne({
    where: { priceGridFbaFeeId: data.fbaFeeRecord.priceGridFbaFeeId },
  });
  if (!data.priceGridFbaFeeRecord)
    throw new Error(
      `No PriceGridFbaFee record found for priceGridFbaFeeId ${data.fbaFeeRecord.priceGridFbaFeeId}.`,
    );

  // Fetch PricingRule record
  data.pricingRuleRecord = await db.PricingRule.findOne({
    where: { pricingRuleId: 1 }, // Assuming a default or specific pricing rule is being used
  });
  if (!data.pricingRuleRecord)
    throw new Error('No pricing rule record found for pricing rule ID 1.');

  // Fetch ProductTaxCategory and related VatRatePerCountry record
  data.productTaxCategory = await db.ProductTaxCategory.findByPk(
    data.asinRecord.productTaxCategoryId,
  );
  data.vatRateRecord = await db.VatRatePerCountry.findOne({
    where: {
      countryCode: data.skuRecord.countryCode,
      vatCategoryId: data.productTaxCategory
        ? data.productTaxCategory.vatCategoryId
        : null,
    },
  });
  if (!data.vatRateRecord)
    throw new Error(
      `No VAT rate record found for country code ${data.skuRecord.countryCode}.`,
    );

  if (createLog) {
    logger(logMessage, logContext);
  }
  return data;
}

module.exports = { fetchDataForSellingPriceCalculation };
