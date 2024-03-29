const db = require('../../database/models/index');

/**
 * @function getAsinFromSkuId
 * @description Retrieves the ASIN associated with a given SKU ID.
 * @async
 * @param {int} skuId - The SKU ID to search for.
 * @return {Promise<string|null>} - A promise that resolves with the ASIN associated with the SKU ID, or null if no ASIN is found.
 */
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
