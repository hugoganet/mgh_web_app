const db = require('../models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');
const {
  calculateMinimumSellingPrice,
} = require('../../utils/calculateSellingPrices');

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
  try {
    // Get the SKU record
    const skuRecord = await db.Sku.findOne({
      where: { skuId },
    });
    if (!skuRecord) {
      logMessage += `No SKU record found for SKU ID ${skuId}.`;
      return;
    }
    const countryCode = skuRecord.countryCode;

    // Get the currency code for the country code
    const { currencyCode } = convertMarketplaceIdentifier(countryCode);

    // Get the ASIN record
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

    // Get the Amazon referral fee record
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
    // Extract and convert the referral fee record fields
    const referralFeeCategoryId = amazonReferralFeeRecord.referralFeeCategoryId;
    const closingFee = parseFloat(amazonReferralFeeRecord.closingFee);
    const referralFeePercentage = parseFloat(
      amazonReferralFeeRecord.referralFeePercentage,
    );
    const perItemMinimumReferralFee = parseFloat(
      amazonReferralFeeRecord.perItemMinimumReferralFee,
    );

    // Handle potential nulls for optional/nullable fields
    const reducedReferralFeePercentage =
      amazonReferralFeeRecord.reducedReferralFeePercentage
        ? parseFloat(amazonReferralFeeRecord.reducedReferralFeePercentage)
        : null;
    const reducedReferralFeeLimit =
      amazonReferralFeeRecord.reducedReferralFeeLimit
        ? parseFloat(amazonReferralFeeRecord.reducedReferralFeeLimit)
        : null;
    // const reducedReferralFeeThreshold =
    //   amazonReferralFeeRecord.reducedReferralFeeThreshold
    //     ? parseFloat(amazonReferralFeeRecord.reducedReferralFeeThreshold)
    //     : null;

    // const applicableReferralFeePercentageLocalAndPanEu = referralFeePercentage;
    // const applicableReferralFeePercentageEfn = referralFeePercentage;
    // const usedReducedReferralFeePercentageLocalAndPanEu = false;
    // const usedReducedReferralFeePercentageEfn = false;

    const fbaFeeRecord = await db.FbaFee.findOne({
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
    const { vatCategoryId } =
      await db.ProductTaxCategory.findByPk(productTaxCategoryId);
    const vatRateRecord = await db.VatRatePerCountry.findOne({
      where: {
        countryCode,
        vatCategoryId,
      },
    });
    if (!vatRateRecord) {
      logMessage += `No VAT rate record found for country code ${countryCode} and VAT category ID ${vatCategoryId}.`;
      return;
    }
    const vatRate = parseFloat(vatRateRecord.vatRate);

    // ! From here on, I'll have to add the converting logic for currencyCode !== 'EUR
    let skuAcquisitionCostExc = 0;
    if (currencyCode === 'EUR') {
      skuAcquisitionCostExc = parseFloat(skuRecord.skuAcquisitionCostExc);
    } else {
      logMessage += `Cannot create minimum selling price record for SKU ID ${skuId} because the currency code ${currencyCode} is not supported.`;
      return;
    }

    const fbaFeeLocalAndPanEu = parseFloat(
      priceGridFbaFeeRecord.fbaFeeLocalAndPanEu,
    );
    const fbaFeeLowPriceLocalAndPanEu =
      priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu
        ? parseFloat(priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu)
        : null;
    const fbaFeeEfn = parseFloat(priceGridFbaFeeRecord.fbaFeeEfn);
    const fbaFeeLowPriceEfn = priceGridFbaFeeRecord.fbaFeeLowPriceEfn
      ? parseFloat(priceGridFbaFeeRecord.fbaFeeLowPriceEfn)
      : null;
    const lowPriceSellingPriceThresholdInc =
      priceGridFbaFeeRecord.lowPriceSellingPriceThresholdInc
        ? parseFloat(priceGridFbaFeeRecord.lowPriceSellingPriceThresholdInc)
        : null;

    const minimumMarginAmount = Math.max(
      skuAcquisitionCostExc *
        parseFloat(pricingRuleRecord.pricingRuleMinimumRoiPercentage),
      parseFloat(pricingRuleRecord.pricingRuleMinimumMarginAmount),
    );

    const minimumSellingPriceLocalAndPanEu = parseFloat(
      calculateMinimumSellingPrice(
        skuAcquisitionCostExc,
        minimumMarginAmount,
        closingFee,
        fbaFeeLocalAndPanEu,
        fbaFeeLowPriceLocalAndPanEu,
        lowPriceSellingPriceThresholdInc,
        vatRate,
        referralFeePercentage,
        reducedReferralFeePercentage,
        reducedReferralFeeLimit,
      ),
    ).toFixed(2);

    const minimumSellingPriceEfn = parseFloat(
      calculateMinimumSellingPrice(
        skuAcquisitionCostExc,
        minimumMarginAmount,
        closingFee,
        fbaFeeEfn,
        fbaFeeLowPriceEfn,
        lowPriceSellingPriceThresholdInc,
        vatRate,
        referralFeePercentage,
        reducedReferralFeePercentage,
        reducedReferralFeeLimit,
      ),
    ).toFixed(2);

    // const minimumSellingPriceRecord = await db.MinimumSellingPrice.create({
    //   skuId,
    //   pricingRuleId: 1,
    //   enrolledInPanEu: false,
    //   eligibleForPanEu: false,
    //   referralFeeCategoryId,
    //   minimumMarginAmount,
    //   minimumSellingPriceLocalAndPanEu,
    //   minimumSellingPriceEfn,
    // maximumSellingPriceLocalAndPanEu,
    // maximumSellingPriceEfn,
    //   currencyCode,
    // });

    console.log(
      `minimumSellingPriceLocalAndPanEu => ${minimumSellingPriceLocalAndPanEu} : ${typeof minimumSellingPriceLocalAndPanEu}`,
    );
    console.log(
      `minimumSellingPriceEfn => ${minimumSellingPriceEfn} : ${typeof minimumSellingPriceEfn}`,
    );
  } catch (error) {
    console.log(
      'Overrall error in automaticallyCreateMinSellingPriceRecord',
      error,
    );
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { automaticallyCreateMinSellingPriceRecord };

// automaticallyCreateMinSellingPriceRecord(2, true); // Book Low-price
automaticallyCreateMinSellingPriceRecord(3635, true); // Low-price, reduced referral fee
