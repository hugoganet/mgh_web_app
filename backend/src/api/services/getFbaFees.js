const db = require('../models');

const getFbaFees = async asinId => {
  try {
    const fbaFee = await db.FbaFee.findOne({ where: { asinId: asinId } });
    if (!fbaFee) {
      console.warn(`No FbaFee found for ASIN ID: ${asinId}`);
      return null;
    }

    const priceGridFbaFee = await db.PriceGridFbaFee.findOne({
      where: { priceGridFbaFeeId: fbaFee.priceGridFbaFeeId },
    });
    if (!priceGridFbaFee) {
      console.warn(
        `No PriceGridFbaFee found for FbaFee ID: ${fbaFee.priceGridFbaFeeId}`,
      );
      return null;
    }

    return {
      fbaFeeLocalAndPanEu: priceGridFbaFee.fbaFeeLocalAndPanEu,
      fbaFeeEfn: priceGridFbaFee.fbaFeeEfn,
      fbaFeecurrencyCode: priceGridFbaFee.currencyCode,
    };
  } catch (error) {
    console.error('Error retrieving FBA fees:', error);
    return null;
  }
};

module.exports = {
  getFbaFees,
};
