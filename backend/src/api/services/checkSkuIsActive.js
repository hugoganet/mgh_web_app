const db = require('../models/index');

/**
 * @description Checks if a SKU is active based on the latest afnInventoryDailyUpdate's afnFulfillableQuantity. Sets the SKU's isActive status in the Sku table accordingly.
 * @function checkSkuIsActive
 * @async
 * @param {number} skuId - The ID of the SKU to check.
 * @return {Promise<void>} - The function doesn't return a value but updates the database.
 */
const checkSkuIsActive = async skuId => {
  try {
    // Find the latest afnInventoryDailyUpdate for the sku
    const latestUpdate = await db.AfnInventoryDailyUpdate.findOne({
      where: { skuId },
      order: [['createdAt', 'DESC']],
    });

    if (!latestUpdate) {
      // console.warn(`No afnInventoryDailyUpdate found for SKU ID: ${skuId}.`);
      await db.Sku.update({ isActive: false }, { where: { skuId: skuId } });
      return;
    }

    // Determine if SKU should be active based on afnFulfillableQuantity
    const isActive = latestUpdate.afnFulfillableQuantity >= 1;

    // Update the Sku table with the new active status
    await db.Sku.update({ isActive }, { where: { skuId: skuId } });
  } catch (error) {
    console.error('Error checking and updating SKU active status:', error);
  }
};

module.exports = {
  checkSkuIsActive,
};
