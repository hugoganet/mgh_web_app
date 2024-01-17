const db = require('../models/index');
const { logAndCollect } = require('../../integrations/sp_api/logs/logger');

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
      order: [['createdAt', 'DESC']],
    });

    if (!latestUpdate) {
      logMessage += `No afnInventoryDailyUpdate found for SKU ID: ${skuId}. Setting SKU as inactive.\n`;
      await db.Sku.update({ isActive: false }, { where: { skuId } });
    } else {
      const isActive = latestUpdate.afnFulfillableQuantity >= 1;
      logMessage += `SKU ID: ${skuId} is determined to be ${
        isActive ? 'active' : 'inactive'
      } based on fulfillable quantity.\n`;
      await db.Sku.update({ isActive }, { where: { skuId } });
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
