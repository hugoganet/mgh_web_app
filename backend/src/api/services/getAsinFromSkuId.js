const db = require('../models');

const getAsinFromSkuId = async skuId => {
  try {
    const asinSkuRecord = await db.AsinSku.findOne({ where: { skuId } });
    if (!asinSkuRecord) {
      console.warn(`No ASIN found for SKU ID: ${skuId}`);
      return null;
    }

    return asinSkuRecord.dataValues.asinId;
  } catch (error) {
    console.error('Error retrieving ASIN:', error);
    return null;
  }
};

module.exports = {
  getAsinFromSkuId,
};
