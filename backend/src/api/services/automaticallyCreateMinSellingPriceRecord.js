const db = require('../models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');
const {
  calculateSellingPrices,
} = require('../../utils/calculateSellingPrices');
const {
  parseAndValidateNumber,
} = require('../../utils/parseAndValidateNumber');

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
    const isHazmat = asinRecord.isHazmat;

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
      where: { countryCode },
    });
    if (!amazonReferralFeeRecord) {
      logMessage += `No referral fee record found for product category ID ${productCategoryId} and country code ${countryCode}.`;
      return;
    }
    // Extract and convert the referral fee record fields
    const referralFeeCategoryId = amazonReferralFeeRecord.referralFeeCategoryId;
    const closingFee = parseAndValidateNumber(
      amazonReferralFeeRecord.closingFee,
      {
        paramName: 'closingFee',
        min: 0,
      },
    );
    const referralFeePercentage = parseAndValidateNumber(
      amazonReferralFeeRecord.referralFeePercentage,
      {
        paramName: 'referralFeePercentage',
        min: 0,
        max: 1,
      },
    );
    const perItemMinimumReferralFee = parseAndValidateNumber(
      amazonReferralFeeRecord.perItemMinimumReferralFee,
      {
        paramName: 'perItemMinimumReferralFee',
        min: 0,
      },
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
    const vatRate = parseAndValidateNumber(vatRateRecord.vatRate, {
      paramName: 'vatRate',
      min: 0,
      max: 1,
    });

    // ! From here on, I'll have to add the converting logic for currencyCode !== 'EUR
    let skuAcquisitionCostExc = 0;
    if (currencyCode === 'EUR') {
      skuAcquisitionCostExc = parseAndValidateNumber(
        skuRecord.skuAcquisitionCostExc,
        {
          paramName: 'skuAcquisitionCostExc',
          min: 0,
        },
      );
    } else {
      logMessage += `Cannot create minimum selling price record for SKU ID ${skuId} because the currency code ${currencyCode} is not supported.`;
      return;
    }

    const fbaFeeLocalAndPanEu = parseAndValidateNumber(
      priceGridFbaFeeRecord.fbaFeeLocalAndPanEu,
      {
        paramName: 'fbaFeeLocalAndPanEu',
        min: 0,
      },
    );
    const fbaFeeLowPriceLocalAndPanEu =
      priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu
        ? parseAndValidateNumber(
            priceGridFbaFeeRecord.fbaFeeLowPriceLocalAndPanEu,
            {
              paramName: 'fbaFeeLowPriceLocalAndPanEu',
              min: 0,
            },
          )
        : null;
    const fbaFeeEfn = parseAndValidateNumber(priceGridFbaFeeRecord.fbaFeeEfn, {
      paramName: 'fbaFeeEfn',
      min: 0,
    });
    const fbaFeeLowPriceEfn = priceGridFbaFeeRecord.fbaFeeLowPriceEfn
      ? parseAndValidateNumber(priceGridFbaFeeRecord.fbaFeeLowPriceEfn, {
          paramName: 'fbaFeeLowPriceEfn',
          min: 0,
        })
      : null;

    if (isHazmat) {
      const hazmatFee = priceGridFbaFeeRecord.hazmatFee
        ? parseAndValidateNumber(priceGridFbaFeeRecord.hazmatFee, {
            paramName: 'hazmatFee',
            min: 0,
          })
        : null;
      fbaFeeLocalAndPanEu += hazmatFee;
      fbaFeeEfn += hazmatFee;
      if (fbaFeeLowPriceLocalAndPanEu) {
        fbaFeeLowPriceLocalAndPanEu += hazmatFee;
      }
      if (fbaFeeLowPriceEfn) {
        fbaFeeLowPriceEfn += hazmatFee;
      }
    }
    const lowPriceThresholdInc = priceGridFbaFeeRecord.lowPriceThresholdInc
      ? parseAndValidateNumber(priceGridFbaFeeRecord.lowPriceThresholdInc, {
          paramName: 'lowPriceThresholdInc',
          min: 0,
        })
      : null;

    const minimumMarginAmount = Math.max(
      skuAcquisitionCostExc *
        parseAndValidateNumber(
          pricingRuleRecord.pricingRuleMinimumRoiPercentage,
          {
            paramName: 'pricingRuleMinimumRoiPercentage',
            min: 0,
            max: 1,
          },
        ),
      parseAndValidateNumber(pricingRuleRecord.pricingRuleMinimumMarginAmount, {
        parseAndValidateNumber: 'pricingRuleMinimumMarginAmount',
        min: 0,
      }),
    );

    const {
      minimumSellingPrice: minimumSellingPriceLocalAndPanEu,
      maximumSellingPrice: maximumSellingPriceLocalAndPanEu,
    } = calculateSellingPrices(
      skuAcquisitionCostExc,
      minimumMarginAmount,
      closingFee,
      fbaFeeLocalAndPanEu,
      fbaFeeLowPriceLocalAndPanEu,
      lowPriceThresholdInc,
      vatRate,
      referralFeePercentage,
      reducedReferralFeePercentage,
      reducedReferralFeeLimit,
    );

    const {
      minimumSellingPrice: minimumSellingPriceEfn,
      maximumSellingPrice: maximumSellingPriceEfn,
    } = calculateSellingPrices(
      skuAcquisitionCostExc,
      minimumMarginAmount,
      closingFee,
      fbaFeeEfn,
      fbaFeeLowPriceEfn,
      lowPriceThresholdInc,
      vatRate,
      referralFeePercentage,
      reducedReferralFeePercentage,
      reducedReferralFeeLimit,
    );

    // TODO : Just before inserting into database, I have to change the sellingPrices for 2 decimal points
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

    console.log(
      `minimumSellingPriceLocalAndPanEu => ${minimumSellingPriceLocalAndPanEu} : ${typeof minimumSellingPriceLocalAndPanEu}`,
    );
    console.log(
      `maximumSellingPriceLocalAndPanEu => ${maximumSellingPriceLocalAndPanEu} : ${typeof maximumSellingPriceLocalAndPanEu}`,
    );
    console.log(
      `minimumSellingPriceEfn => ${minimumSellingPriceEfn} : ${typeof minimumSellingPriceEfn}`,
    );
    console.log(
      `maximumSellingPriceEfn => ${maximumSellingPriceEfn} : ${typeof maximumSellingPriceEfn}`,
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
