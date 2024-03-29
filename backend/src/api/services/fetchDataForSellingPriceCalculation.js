const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const {
  parseAndValidateNumber,
} = require('../../utils/parseAndValidateNumber');
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
  try {
    const skuRecord = await db.Sku.findOne({ where: { skuId } });
    if (!skuRecord) {
      logMessage += `No SKU record found in fetchDataForSellingPriceCalculation for SKU ID ${skuId}.`;
    } else {
      logMessage += `Fetched SKU in fetchDataForSellingPriceCalculation record for SKU ID ${skuId}.`;
    }

    const asinRecord = await db.Asin.findOne({
      include: [{ model: db.Sku, where: { skuId }, required: true }],
    });
    if (!asinRecord) {
      logMessage += `No ASIN record in fetchDataForSellingPriceCalculation found for SKU ID ${skuId}.`;
    } else {
      logMessage += `Fetched ASIN record in fetchDataForSellingPriceCalculation for SKU ID ${skuId}.`;
    }

    const amazonReferralFeeRecord = await db.AmazonReferralFee.findOne({
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
    if (!amazonReferralFeeRecord) {
      logMessage += `No referral fee record found for product category ID ${asinRecord.productCategoryId} and country code ${skuRecord.countryCode}.`;
    } else {
      logMessage += `Fetched referral fee record in fetchDataForSellingPriceCalculation for product category ID ${asinRecord.productCategoryId} and country code ${skuRecord.countryCode}.`;
    }

    const fbaFeeRecord = await db.FbaFee.findOne({
      where: { asinId: asinRecord.asinId },
    });
    if (!fbaFeeRecord) {
      logMessage += `No FBA fee record found for ASIN ID ${asinRecord.asinId}.`;
    } else {
      logMessage += `Fetched FBA fee record in fetchDataForSellingPriceCalculation for ASIN ID ${asinRecord.asinId}.`;
    }

    const priceGridFbaFeeRecord = await db.PriceGridFbaFee.findOne({
      where: { priceGridFbaFeeId: fbaFeeRecord.priceGridFbaFeeId },
    });
    if (!priceGridFbaFeeRecord) {
      logMessage += `No PriceGridFbaFee record found for priceGridFbaFeeId ${fbaFeeRecord.priceGridFbaFeeId}.`;
    } else {
      logMessage += `Fetched PriceGridFbaFee record in fetchDataForSellingPriceCalculation for priceGridFbaFeeId ${fbaFeeRecord.priceGridFbaFeeId}.`;
    }

    const pricingRuleRecord = await db.PricingRule.findOne({
      where: { pricingRuleId: 1 },
    });
    if (!pricingRuleRecord) {
      logMessage += 'No pricing rule record found for pricing rule ID 1.';
    } else {
      logMessage +=
        'Fetched pricing rule record in fetchDataForSellingPriceCalculation for pricing rule ID 1.';
    }

    const productTaxCategory = await db.ProductTaxCategory.findByPk(
      asinRecord.productTaxCategoryId,
    );
    if (!productTaxCategory) {
      logMessage += `No productTaxCategory record found in fetchDataForSellingPriceCalculation for productTaxCategoryId: ${asinRecord.productTaxCategoryId}.`;
    } else {
      logMessage += `Fetched productTaxCategory record in fetchDataForSellingPriceCalculation for productTaxCategoryId: ${asinRecord.productTaxCategoryId}.`;
    }

    const vatRateRecord = await db.VatRatePerCountry.findOne({
      where: {
        countryCode: skuRecord.countryCode,
        vatCategoryId: productTaxCategory.vatCategoryId,
      },
    });
    if (!vatRateRecord) {
      logMessage += `No VAT rate record found for country code ${skuRecord.countryCode}.`;
    } else {
      logMessage += `Fetched VAT rate record in fetchDataForSellingPriceCalculation for country code ${skuRecord.countryCode}.`;
    }

    // Convert currency if necessary
    const currencyCode = convertMarketplaceIdentifier(
      skuRecord.countryCode,
    ).currencyCode;

    // Parse and validate numerical fields
    const parsedData = {
      skuAcquisitionCostExc: parseAndValidateNumber(
        skuRecord.skuAcquisitionCostExc,
        { paramName: 'skuAcquisitionCostExc', min: 0, decimals: 2 },
      ),
      minimumMarginAmount: Math.max(
        parseAndValidateNumber(skuRecord.skuAcquisitionCostExc, {
          paramName: 'skuAcquisitionCostExc',
          min: 0,
        }) *
          parseAndValidateNumber(
            pricingRuleRecord.pricingRuleMinimumRoiPercentage,
            { paramName: 'pricingRuleMinimumRoiPercentage', min: 0, max: 1 },
          ),
        parseAndValidateNumber(
          pricingRuleRecord.pricingRuleMinimumMarginAmount,
          { paramName: 'pricingRuleMinimumMarginAmount', min: 0 },
        ),
      ),
      closingFee: parseAndValidateNumber(amazonReferralFeeRecord.closingFee, {
        paramName: 'closingFee',
        min: 0,
        decimals: 2,
      }),
      fbaFeeLocalAndPanEu: parseAndValidateNumber(
        priceGridFbaFeeRecord.fbaFeeLocalAndPanEu,
        { paramName: 'fbaFeeLocalAndPanEu', min: 0, decimals: 2 },
      ),
      fbaFeeLowPriceLocalAndPanEu: parseAndValidateNumber(
        priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu || 0,
        { paramName: 'fbaFeeLowPriceLocalAndPanEu', min: 0, decimals: 2 },
      ),
      fbaFeeEfn: parseAndValidateNumber(priceGridFbaFeeRecord.fbaFeeEfn, {
        paramName: 'fbaFeeEfn',
        min: 0,
        decimals: 2,
      }),
      fbaFeeLowPriceEfn: parseAndValidateNumber(
        priceGridFbaFeeRecord.fbaFeeLowPriceEfn || 0,
        { paramName: 'fbaFeeLowPriceEfn', min: 0, decimals: 2 },
      ),
      lowPriceThresholdInc: parseAndValidateNumber(
        priceGridFbaFeeRecord.lowPriceThresholdInc || 0,
        { paramName: 'lowPriceThresholdInc', min: 0, decimals: 2 },
      ),
      vatRate: parseAndValidateNumber(vatRateRecord.vatRate, {
        paramName: 'vatRate',
        min: 0,
        max: 1,
      }),
      referralFeePercentage: parseAndValidateNumber(
        amazonReferralFeeRecord.referralFeePercentage,
        { paramName: 'referralFeePercentage', min: 0, max: 1 },
      ),
      reducedReferralFeePercentage: parseAndValidateNumber(
        amazonReferralFeeRecord.reducedReferralFeePercentage || 0,
        { paramName: 'reducedReferralFeePercentage', min: 0, max: 1 },
      ),
      reducedReferralFeeLimit: parseAndValidateNumber(
        amazonReferralFeeRecord.reducedReferralFeeLimit || 0,
        { paramName: 'reducedReferralFeeLimit', min: 0, decimals: 2 },
      ),
      referralFeeCategoryId: amazonReferralFeeRecord.referralFeeCategoryId,
      isHazmat: asinRecord.isHazmat,
      countryCode: skuRecord.countryCode,
      currencyCode,
    };

    logMessage = `Fetched data for SKU ID ${skuId}. DATA: ${JSON.stringify(
      parsedData,
      '',
      2,
    )}`;
    return parsedData;
  } catch (error) {
    console.error(`Error in fetchDataForSellingPriceCalculation: ${error}`);
    throw error; // Rethrow to handle it in the caller or log it
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { fetchDataForSellingPriceCalculation };
