const db = require('../models');

// If the sku has the pan EU advantage, the fba fee used are local and pan EU, otherwise it's the EFN fee
// I'm not 100% sure how to get this information, so I'll just check in minimum_selling_price table. If for a skuId (sku + countryCode), the enrolledInPanEU is true, then I'll apply the Local and PanEu fee. Otherwise, I'll apply the EFN fee.
// This function is going to be used in the fbaSalesProcessed, so I'll get the countryCode from the salesChannel field, so it will only be (FR ; DE ; ES ; IT ; BE ; NL ; SE ; PL),
/**
 * @function getFbaFeeType
 * @description Get the FBA fee type (localAndPanEu or efn) for a given SKU ID
 * @async
 * @param {int} skuId
 * @return {Promise<string|null>} - A promise that resolves to the FBA fee type (localAndPanEu or efn) for a given SKU ID
 */
const getFbaFeeType = async skuId => {
  try {
    const minimumSellingPriceRecord = await db.MinimumSellingPrice.findOne({
      where: { skuId },
    });
    if (!minimumSellingPriceRecord) {
      console.warn(`No minimumSellingPriceRecord found for SKU ID: ${skuId}`);
      return null;
    }

    return minimumSellingPriceRecord.enrolledInPanEu
      ? 'fbaFeeLocalAndPanEu'
      : 'fbaFeeEfn';
  } catch (error) {
    console.error('Error retrieving FBA fee type:', error);
    return null;
  }
};

module.exports = {
  getFbaFeeType,
};
