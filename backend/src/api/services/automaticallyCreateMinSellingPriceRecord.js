const db = require('../models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');
const {
  calculateMinimumSellingPrices,
} = require('../../utils/calculateMinimumSellingPrices');

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

    // Extract and convert numeric values from strings
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
    const reducedReferralFeeThreshold =
      amazonReferralFeeRecord.reducedReferralFeeThreshold
        ? parseFloat(amazonReferralFeeRecord.reducedReferralFeeThreshold)
        : null;

    const applicableReferralFeePercentageLocalAndPanEu = referralFeePercentage;
    const applicableReferralFeePercentageEfn = referralFeePercentage;
    const usedReducedReferralFeePercentageLocalAndPanEu = false;
    const usedReducedReferralFeePercentageEfn = false;

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
    const fbaFeeEfn = parseFloat(priceGridFbaFeeRecord.fbaFeeEfn);
    const fbaFeeLowPriceLocalAndPanEu =
      priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu
        ? parseFloat(priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu)
        : null;
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

    // const minimumSellingPriceRecord = await db.MinimumSellingPrice.create({
    //   skuId,
    //   pricingRuleId: 1,
    //   enrolledInPanEu: false,
    //   eligibleForPanEu: false,
    //   referralFeeCategoryId,
    //   minimumMarginAmount,
    //   minimumSellingPriceLocalAndPanEu,
    //   minimumSellingPriceEfn,
    //   maximumSellingPriceLocalAndPanEu,
    //   maximumSellingPriceEfn,
    //   currencyCode,
    // });

    console.log(`${JSON.stringify({ amazonReferralFeeRecord }, null, 2)}`);
    console.log(`${JSON.stringify({ priceGridFbaFeeRecord }, null, 2)}`);
    console.log(`countryCode => ${countryCode} : ${typeof countryCode}`);
    console.log(`currencyCode => ${currencyCode} : ${typeof currencyCode}`);
    console.log(
      `productCategoryId => ${productCategoryId} : ${typeof productCategoryId}`,
    );
    console.log(
      `referralFeeCategoryId => ${referralFeeCategoryId} : ${typeof referralFeeCategoryId}`,
    );
    console.log(`closingFee => ${closingFee} : ${typeof closingFee}`);
    console.log(
      `reducedReferralFeePercentage => ${reducedReferralFeePercentage} : ${typeof reducedReferralFeePercentage}`,
    );
    console.log(
      `referralFeePercentage => ${referralFeePercentage} : ${typeof referralFeePercentage}`,
    );
    console.log(
      `reducedReferralFeeLimit => ${reducedReferralFeeLimit} : ${typeof reducedReferralFeeLimit}`,
    );
    console.log(
      `reducedReferralFeeThreshold => ${reducedReferralFeeThreshold} : ${typeof reducedReferralFeeThreshold}`,
    );
    console.log(
      `perItemMinimumReferralFee => ${perItemMinimumReferralFee} : ${typeof perItemMinimumReferralFee}`,
    );
    console.log(
      `productTaxCategoryId => ${productTaxCategoryId} : ${typeof productTaxCategoryId}`,
    );
    console.log(`vatCategoryId => ${vatCategoryId} : ${typeof vatCategoryId}`);
    console.log(`vatRate => ${vatRate} : ${typeof vatRate}`);
    console.log(
      `skuAcquisitionCostExc => ${skuAcquisitionCostExc} : ${typeof skuAcquisitionCostExc}`,
    );
    console.log(
      `fbaFeeLocalAndPanEu => ${fbaFeeLocalAndPanEu} : ${typeof fbaFeeLocalAndPanEu}`,
    );
    console.log(`fbaFeeEfn => ${fbaFeeEfn} : ${typeof fbaFeeEfn}`);
    console.log(
      `fbaFeeLowPriceLocalAndPanEu => ${fbaFeeLowPriceLocalAndPanEu} : ${typeof fbaFeeLowPriceLocalAndPanEu}`,
    );
    console.log(
      `fbaFeeLowPriceEfn => ${fbaFeeLowPriceEfn} : ${typeof fbaFeeLowPriceEfn}`,
    );
    console.log(
      `lowPriceSellingPriceThresholdInc => ${lowPriceSellingPriceThresholdInc} : ${typeof lowPriceSellingPriceThresholdInc}`,
    );
    console.log(
      `minimumMarginAmount => ${minimumMarginAmount} : ${typeof minimumMarginAmount}`,
    );
    calculateMinimumSellingPrices(
      skuAcquisitionCostExc,
      minimumMarginAmount,
      closingFee,
      fbaFeeLocalAndPanEu,
      fbaFeeLowPriceLocalAndPanEu,
      fbaFeeEfn,
      fbaFeeLowPriceEfn,
      lowPriceSellingPriceThresholdInc,
      vatRate,
      referralFeePercentage,
      reducedReferralFeePercentage,
      reducedReferralFeeLimit,
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
