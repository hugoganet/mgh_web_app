const db = require('../models/index');

/**
 * Updates the SKU's total AFN quantity based on the latest entry from AfnInventoryDailyUpdate.
 *
 * @async
 * @param {number} skuId - The ID of the SKU to update.
 * @return {Promise<void>} - The function doesn't return a value but updates the database.
 */
const updateAfnQuantity = async skuId => {
  try {
    // Find the latest afnInventoryDailyUpdate for the sku
    const latestUpdate = await db.AfnInventoryDailyUpdate.findOne({
      where: { skuId },
      order: [['createdAt', 'DESC']],
    });

    if (!latestUpdate) {
      // console.warn(`No afnInventoryDailyUpdate found for SKU ID: ${skuId}.`);
      return;
    }

    // Assume you're updating the total quantity field in the Sku table
    const skuAfnTotalQuantity = latestUpdate.afnFulfillableQuantity;
    await db.Sku.update({ skuAfnTotalQuantity }, { where: { skuId: skuId } });
  } catch (error) {
    console.error('Error updating SKU AFN total quantity:', error);
  }
};

module.exports = {
  updateAfnQuantity,
};
