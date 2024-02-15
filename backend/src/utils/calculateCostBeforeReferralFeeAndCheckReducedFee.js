const { convertToEur } = require('./convertToEur');
const { logger } = require('./logger');
const { parseAndValidateNumber } = require('./parseAndValidateNumber');

/**
 * @description Check if reduced referral fee is applicable and return the applicable percentage.
 * @function calculateCostBeforeReferralFeeAndCheckReducedFee
 * @param {number} skuAcquisitionCostExc - The SKU acquisition cost excluding VAT.
 * @param {number} minimumMarginAmount - The minimum margin amount.
 * @param {number} closingFee - The closing fee.
 * @param {number} fbaFee - The FBA fee.
 * @param {number} reducedReferralFeeLimit - The reduced referral fee limit.
 * @param {number} vatRate - The VAT rate.
 * @param {number} reducedReferralFeePercentage - The reduced referral fee percentage.
 * @param {number} referralFeePercentage - The referral fee percentage.
 * @param {string} currencyCode - The currency code.
 * @param {boolean} createLog - Whether to create a log for this operation.
 * @param {string} logContext - The context for the log message.
 * @return {Object} An object with the following properties: costBeforeReferralFees, applicableReferralFeePercentage, reducedReferralFeeThresholdSellingPriceInc.
 */
async function calculateCostBeforeReferralFeeAndCheckReducedFee(
  skuAcquisitionCostExc,
  minimumMarginAmount,
  closingFee,
  fbaFee,
  reducedReferralFeeLimit,
  vatRate,
  reducedReferralFeePercentage,
  referralFeePercentage,
  currencyCode,
  createLog = false,
  logContext = 'calculateCostBeforeReferralFeeAndCheckReducedFee',
) {
  let logMessage = '';
  try {
    const today = new Date().toISOString().slice(0, 10);
    let costBeforeReferralFees;

    if (currencyCode === 'EUR') {
      costBeforeReferralFees =
        skuAcquisitionCostExc + minimumMarginAmount + closingFee + fbaFee;
    } else {
      try {
        costBeforeReferralFees =
          (await convertToEur(
            skuAcquisitionCostExc,
            currencyCode,
            today,
            true,
            logContext,
          )) +
          (await convertToEur(
            minimumMarginAmount,
            currencyCode,
            today,
            true,
            logContext,
          )) +
          closingFee +
          (await convertToEur(fbaFee, currencyCode, today, true, logContext));
      } catch (error) {
        logMessage += `Currency conversion failed: ${error}`;
      }
    }

    costBeforeReferralFees = parseAndValidateNumber(costBeforeReferralFees, {
      paramName: 'costBeforeReferralFees',
      min: 0,
    });

    const threshold =
      reducedReferralFeeLimit *
      (1 / (1 + vatRate) - reducedReferralFeePercentage);
    const useReducedFee = costBeforeReferralFees <= threshold;
    const applicablePercentage = useReducedFee
      ? reducedReferralFeePercentage
      : referralFeePercentage;

    logMessage = `Cost before referral fees: ${costBeforeReferralFees}. Applicable referral fee percentage: ${applicablePercentage}. Reduced referral fee threshold selling price (inc. VAT): ${
      useReducedFee ? reducedReferralFeeLimit : null
    }.`;
    return {
      costBeforeReferralFees,
      applicableReferralFeePercentage: applicablePercentage,
      reducedReferralFeeThresholdSellingPriceInc: useReducedFee
        ? reducedReferralFeeLimit
        : null,
    };
  } catch (error) {
    console.error(
      `Error in calculateCostBeforeReferralFeeAndCheckReducedFee: ${error.message}`,
    );
    logMessage += ` Error encountered in calculateCostBeforeReferralFeeAndCheckReducedFee. ERROR: ${error}.`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { calculateCostBeforeReferralFeeAndCheckReducedFee };
