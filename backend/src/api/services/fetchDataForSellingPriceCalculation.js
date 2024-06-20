const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const { parseData } = require('../../utils/parseData');
const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');

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
  let logMessage = '';
  let skuRecord;
  let asinRecord;
  let amazonReferralFeeRecord;
  let fbaFeeRecord;
  let priceGridFbaFeeRecord;
  let pricingRuleRecord;
  let productTaxCategory;
  let vatRateRecord;

  try {
    skuRecord = await db.Sku.findOne({ where: { skuId } });
    if (!skuRecord) throw new Error(`No SKU record found for SKU ID ${skuId}.`);
    logMessage += `Fetched SKU record for SKU ID ${skuId}. `;
  } catch (error) {
    logMessage += `Error fetching SKU record for SKU ID ${skuId}: ${error.message}`;
    throw error;
  }

  try {
    asinRecord = await db.Asin.findOne({
      include: [{ model: db.Sku, where: { skuId }, required: true }],
    });
    if (!asinRecord)
      throw new Error(`No ASIN record found for SKU ID ${skuId}.`);
    logMessage += `Fetched ASIN record for SKU ID ${skuId}. `;
  } catch (error) {
    logMessage += `Error fetching ASIN record for SKU ID ${skuId}: ${error.message}`;
    throw error;
  }

  try {
    amazonReferralFeeRecord = await db.AmazonReferralFee.findOne({
      include: [
        {
          model: db.ProductCategory,
          through: {
            model: db.ProductAndAmzReferralFeeCategory,
            where: { productCategoryId: asinRecord.productCategoryId },
          },
          required: true,
        },
      ],
      where: { countryCode: skuRecord.countryCode },
    });
    if (!amazonReferralFeeRecord)
      throw new Error(
        `No referral fee record found for product category ID ${asinRecord.productCategoryId} and country code ${skuRecord.countryCode}.`,
      );
    logMessage += `Fetched referral fee record for product category ID ${asinRecord.productCategoryId} and country code ${skuRecord.countryCode}. `;
  } catch (error) {
    logMessage += `Error fetching referral fee record: ${error.message}`;
    throw error;
  }

  try {
    fbaFeeRecord = await db.FbaFee.findOne({
      where: { asinId: asinRecord.asinId },
    });
    if (!fbaFeeRecord)
      throw new Error(
        `No FBA fee record found for ASIN ID ${asinRecord.asinId}.`,
      );
    logMessage += `Fetched FBA fee record for ASIN ID ${asinRecord.asinId}. `;
  } catch (error) {
    logMessage += `Error fetching FBA fee record: ${error.message}`;
    throw error;
  }

  try {
    priceGridFbaFeeRecord = await db.PriceGridFbaFee.findOne({
      where: { priceGridFbaFeeId: fbaFeeRecord.priceGridFbaFeeId },
    });
    if (!priceGridFbaFeeRecord)
      throw new Error(
        `No PriceGridFbaFee record found for priceGridFbaFeeId ${fbaFeeRecord.priceGridFbaFeeId}.`,
      );
    logMessage += `Fetched PriceGridFbaFee record for priceGridFbaFeeId ${fbaFeeRecord.priceGridFbaFeeId}. `;
  } catch (error) {
    logMessage += `Error fetching PriceGridFbaFee record: ${error.message}`;
    throw error;
  }

  try {
    pricingRuleRecord = await db.PricingRule.findOne({
      where: { pricingRuleId: 1 },
    });
    if (!pricingRuleRecord)
      throw new Error('No pricing rule record found for pricing rule ID 1.');
    logMessage += `Fetched pricing rule record for pricing rule ID 1. `;
  } catch (error) {
    logMessage += `Error fetching pricing rule record: ${error.message}`;
    throw error;
  }

  try {
    productTaxCategory = await db.ProductTaxCategory.findByPk(
      asinRecord.productTaxCategoryId,
    );
    if (!productTaxCategory)
      throw new Error(
        `No productTaxCategory record found for productTaxCategoryId: ${asinRecord.productTaxCategoryId}.`,
      );
    logMessage += `Fetched productTaxCategory record for productTaxCategoryId: ${asinRecord.productTaxCategoryId}. `;
  } catch (error) {
    logMessage += `Error fetching productTaxCategory record: ${error.message}`;
    throw error;
  }

  try {
    vatRateRecord = await db.VatRatePerCountry.findOne({
      where: {
        countryCode: skuRecord.countryCode,
        vatCategoryId: productTaxCategory.vatCategoryId,
      },
    });
    if (!vatRateRecord)
      throw new Error(
        `No VAT rate record found for country code ${skuRecord.countryCode}.`,
      );
    logMessage += `Fetched VAT rate record for country code ${skuRecord.countryCode}. `;
  } catch (error) {
    logMessage += `Error fetching VAT rate record: ${error.message}`;
    throw error;
  }

  try {
    const marketplaceInfo = convertMarketplaceIdentifier(skuRecord.countryCode);
    if (!marketplaceInfo || !marketplaceInfo.currencyCode) {
      throw new Error(
        `No currency code found for country code ${skuRecord.countryCode}`,
      );
    }

    const currencyCode = marketplaceInfo.currencyCode;

    const parsedData = parseData(
      skuRecord,
      pricingRuleRecord,
      amazonReferralFeeRecord,
      priceGridFbaFeeRecord,
      vatRateRecord,
      asinRecord,
      currencyCode,
    );
    logMessage += `Parsed data for SKU ID ${skuId}. `;

    return parsedData;
  } catch (error) {
    logMessage += `Error parsing data: ${error.message}`;
    throw error;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { fetchDataForSellingPriceCalculation };
