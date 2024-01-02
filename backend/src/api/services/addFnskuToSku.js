const db = require('../models');

/**
 * Updates the FNSKU for a given SKU record in the database.
 * @param {number} skuId - The ID of the SKU to update.
 * @param {string} fnsku - The new FNSKU value to set.
 * @return {Promise<db.Sku>} - The updated SKU record.
 * @throws Will throw an error if the SKU record cannot be found.
 */
const addFnskuToSku = async (skuId, fnsku) => {
  try {
    const skuRecord = await db.Sku.findByPk(skuId);
    if (!skuRecord) {
      throw new Error(`No SKU found for SKU ID: ${skuId}`);
    }

    const updatedRecord = await skuRecord.update({ fnsku });
    if (updatedRecord.skuId === 4047) {
      console.log(updatedRecord);
    }
    return updatedRecord;
  } catch (error) {
    console.error('Error updating FNSKU:', error);
    throw error;
  }
};

module.exports = {
  addFnskuToSku,
};
