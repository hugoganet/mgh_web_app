const db = require('../../database/models/index');

/**
 * Retrieves the SKU acquisition cost based on the SKU ID.
 * @param {string} skuId - The unique identifier for the SKU.
 * @return {Promise<number|null>} - The acquisition cost exclusive of tax, or null if not found.
 */
async function getSkuAcquisitionCostExc(skuId) {
  try {
    const sku = await db.Sku.findOne({
      where: { skuId: skuId },
      attributes: ['skuAcquisitionCostExc'],
    });
    if (!sku) {
      console.warn(`No SKU found for ID: ${skuId}`);
      return null;
    }

    return sku.skuAcquisitionCostExc;
  } catch (error) {
    console.error('Error retrieving SKU acquisition cost:', error);
    return null;
  }
}

module.exports = {
  getSkuAcquisitionCostExc,
};
