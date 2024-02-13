/* eslint-disable require-jsdoc */
function calculateMinimumSellingPrices(
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
  reducedReferralFeePercentage = null, // Assuming this can be null if not applicable
  reducedReferralFeeLimit = null, // Assuming this can be null if not applicable
) {
  // Initialize variables
  let costBeforeReferralFeesLowPriceLocalAndPanEu = null;
  let costBeforeReferralFeesLowPriceEfn = null;
  let thresholdAmountForReducedFeeApplicabilityLocalAndPanEu = null;
  let thresholdAmountForReducedFeeApplicabilityEfn = null;
  let applicableReferralFeePercentageLocalAndPanEu = referralFeePercentage;
  let applicableReferralFeePercentageEfn = referralFeePercentage;
  let useReducedReferralFeePercentageLocalAndPanEu = false;
  let useReducedReferralFeePercentageEfn = false;

  // Calculate cost before VAT and referral fees for Standard and Low-Price parcels
  // Standard Local/Pan-EU
  const costBeforeReferralFeesLocalAndPanEu =
    skuAcquisitionCostExc +
    minimumMarginAmount +
    closingFee +
    fbaFeeLocalAndPanEu;
  // Low-Price Local/Pan-EU
  if (
    lowPriceSellingPriceThresholdInc !== null &&
    fbaFeeLowPriceLocalAndPanEu !== null
  ) {
    costBeforeReferralFeesLowPriceLocalAndPanEu =
      skuAcquisitionCostExc +
      minimumMarginAmount +
      closingFee +
      fbaFeeLowPriceLocalAndPanEu;
  }

  // Standard EFN
  const costBeforeReferralFeesEfn =
    skuAcquisitionCostExc + minimumMarginAmount + closingFee + fbaFeeEfn;
  // Low-Price EFN
  if (lowPriceSellingPriceThresholdInc !== null && fbaFeeLowPriceEfn !== null) {
    costBeforeReferralFeesLowPriceEfn =
      skuAcquisitionCostExc +
      minimumMarginAmount +
      closingFee +
      fbaFeeLowPriceEfn;
  }

  // Check for reduced referral fee applicability for Local and Pan-EU
  if (reducedReferralFeeLimit) {
    // if the referralFeeCategory has reduced referral fee percentage calculate the threshold amount of costA to use the reduced referral fee percentage
    thresholdAmountForReducedFeeApplicabilityLocalAndPanEu =
      reducedReferralFeeLimit *
      (1 / (1 + vatRate) - reducedReferralFeePercentage);
    // if the costALowPrice is less than the threshold amount, use the reduced referral fee percentage
    if (
      costBeforeReferralFeesLowPriceLocalAndPanEu <=
      thresholdAmountForReducedFeeApplicabilityLocalAndPanEu
    ) {
      applicableReferralFeePercentageLocalAndPanEu =
        reducedReferralFeePercentage;
      useReducedReferralFeePercentageLocalAndPanEu = true;
    }
    // else if the costA is less than the threshold amount, use the reduced referral fee percentage
    else if (
      costBeforeReferralFeesLocalAndPanEu <=
      thresholdAmountForReducedFeeApplicabilityLocalAndPanEu
    ) {
      applicableReferralFeePercentageLocalAndPanEu =
        reducedReferralFeePercentage;
      useReducedReferralFeePercentageLocalAndPanEu = true;
    }
  }

  // Check for reduced referral fee applicability for EFN
  if (reducedReferralFeeLimit) {
    // if the referralFeeCategory has reduced referral fee percentage calculate the threshold amount of costA to use the reduced referral fee percentage
    thresholdAmountForReducedFeeApplicabilityEfn =
      reducedReferralFeeLimit *
      (1 / (1 + vatRate) - reducedReferralFeePercentage);
    // if the costALowPrice is less than the threshold amount, use the reduced referral fee percentage
    if (
      costBeforeReferralFeesLowPriceEfn <=
      thresholdAmountForReducedFeeApplicabilityEfn
    ) {
      applicableReferralFeePercentageEfn = reducedReferralFeePercentage;
      useReducedReferralFeePercentageEfn = true;
    }
    // else if the costA is less than the threshold amount, use the reduced referral fee percentage
    else if (
      costBeforeReferralFeesEfn <= thresholdAmountForReducedFeeApplicabilityEfn
    ) {
      applicableReferralFeePercentageEfn = reducedReferralFeePercentage;
      useReducedReferralFeePercentageEfn = true;
    }
  }

  // TODO : if the minimumSellingPrice is less than lowPriceSellingPriceThresholdInc, use costBeforeReferralFeesLowPriceLocalAndPanEu otherwise use costBeforeReferralFeesLocalAndPanEu
  // calculate minimum selling price for local and pan-eu standard parcels
  const minimumSellingPriceLocalAndPanEu = parseFloat(
    costBeforeReferralFeesLocalAndPanEu /
      (1 / (1 + vatRate) - applicableReferralFeePercentageLocalAndPanEu),
  ).toFixed(2);

  // calculate minimum selling price for local and pan-eu low-price parcels
  const minimumSellingPriceLocalAndPanEuLowPrice = parseFloat(
    costBeforeReferralFeesLowPriceLocalAndPanEu /
      (1 / (1 + vatRate) - applicableReferralFeePercentageLocalAndPanEu),
  ).toFixed(2);

  const minimumSellingPriceEfn = parseFloat(
    (
      (skuAcquisitionCostExc + minimumMarginAmount + closingFee + fbaFeeEfn) /
      (1 / (1 + vatRate) - applicableReferralFeePercentageEfn)
    ).toFixed(2),
  );

  console.log(
    `costBeforeReferralFeesLocalAndPanEu => ${costBeforeReferralFeesLocalAndPanEu} : ${typeof costBeforeReferralFeesLocalAndPanEu}`,
  );
  console.log(
    `costBeforeReferralFeesLowPriceLocalAndPanEu => ${costBeforeReferralFeesLowPriceLocalAndPanEu} : ${typeof costBeforeReferralFeesLowPriceLocalAndPanEu}`,
  );
  console.log(
    `costBeforeReferralFeesEfn => ${costBeforeReferralFeesEfn} : ${typeof costBeforeReferralFeesEfn}`,
  );
  console.log(
    `costBeforeReferralFeesLowPriceEfn => ${costBeforeReferralFeesLowPriceEfn} : ${typeof costBeforeReferralFeesLowPriceEfn}`,
  );
  console.log(
    `thresholdAmountForReducedFeeApplicabilityLocalAndPanEu => ${thresholdAmountForReducedFeeApplicabilityLocalAndPanEu} : ${typeof thresholdAmountForReducedFeeApplicabilityLocalAndPanEu}`,
  );
  console.log(
    `thresholdAmountForReducedFeeApplicabilityEfn => ${thresholdAmountForReducedFeeApplicabilityEfn} : ${typeof thresholdAmountForReducedFeeApplicabilityEfn}`,
  );
  console.log(
    `applicableReferralFeePercentageLocalAndPanEu => ${applicableReferralFeePercentageLocalAndPanEu} : ${typeof applicableReferralFeePercentageLocalAndPanEu}`,
  );
  console.log(
    `applicableReferralFeePercentageEfn => ${applicableReferralFeePercentageEfn} : ${typeof applicableReferralFeePercentageEfn}`,
  );
  console.log(
    `useReducedReferralFeePercentageLocalAndPanEu => ${useReducedReferralFeePercentageLocalAndPanEu} : ${typeof useReducedReferralFeePercentageLocalAndPanEu}`,
  );
  console.log(
    `useReducedReferralFeePercentageEfn => ${useReducedReferralFeePercentageEfn} : ${typeof useReducedReferralFeePercentageEfn}`,
  );
  console.log(
    `minimumSellingPriceLocalAndPanEu => ${minimumSellingPriceLocalAndPanEu} : ${typeof minimumSellingPriceLocalAndPanEu}`,
  );
  console.log(
    `minimumSellingPriceLocalAndPanEuLowPrice => ${minimumSellingPriceLocalAndPanEuLowPrice} : ${typeof minimumSellingPriceLocalAndPanEuLowPrice}`,
  );
}

module.exports = { calculateMinimumSellingPrices };
