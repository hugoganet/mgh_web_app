const db = require('../models/index');
const { logAndCollect } = require('../../utils/logger');

/**
 * @description Checks if a SKU is active based on the latest afnInventoryDailyUpdate's afnFulfillableQuantity. Sets the SKU's isActive status in the Sku table accordingly.
 * @function checkSkuIsActive
 * @async
 * @param {number} skuId - The ID of the SKU to check.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<void>} - The function doesn't return a value but updates the database.
 */
const checkSkuIsActive = async (skuId, createLog = false) => {
  let logMessage = `Checking if SKU (ID: ${skuId}) is active.\n`;

  try {
    const latestUpdate = await db.AfnInventoryDailyUpdate.findOne({
      where: { skuId },
    });

    if (!latestUpdate) {
      logMessage += `No afnInventoryDailyUpdate found for SKU ID: ${skuId}. Setting SKU as inactive in skus table.\n`;
      try {
        await db.Sku.update({ isActive: false }, { where: { skuId } });
      } catch (error) {
        logMessage += `Error setting SKU (${skuId}) as inactive: ${error}\n`;
        console.error('Error setting SKU as inactive:', error);
      }
    } else {
      const isActive = latestUpdate.afnFulfillableQuantity >= 1;

      logMessage += `SKU ID: ${skuId} is determined to be ${
        isActive ? 'active' : 'inactive'
      } based on fulfillable quantity. Updating in skus table.\n`;
      try {
        await db.Sku.update({ isActive }, { where: { skuId } });
      } catch (error) {
        logMessage += `Error setting SKU (${skuId}) as ${
          isActive ? 'active' : 'inactive'
        }: ${error}\n`;
        console.error(
          `Error setting SKU as ${isActive ? 'active' : 'inactive'}:`,
          error,
        );
      }
    }
  } catch (error) {
    logMessage += `Error checking and updating SKU active status: ${error}\n`;
    console.error('Error checking and updating SKU active status:', error);
  }

  if (createLog) {
    logAndCollect(logMessage, 'CheckSkuIsActive');
  }
};

module.exports = {
  checkSkuIsActive,
};
