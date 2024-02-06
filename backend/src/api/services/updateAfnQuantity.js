const db = require('../models/index');
const { logger } = require('../../utils/logger');

/**
 * @description Updates the SKU's total AFN quantity based on the latest entry from AfnInventoryDailyUpdate.
 * @function updateAfnQuantity
 * @async
 * @param {number} skuId - The ID of the SKU to update.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<void>} - The function doesn't return a value but updates the database.
 */
async function updateAfnQuantity(
  skuId,
  createLog = false,
  logContext = 'updateAfnQuantity',
) {
  let logMessage = '';
  try {
    const latestUpdate = await db.AfnInventoryDailyUpdate.findOne({
      where: { skuId },
    });

    if (!latestUpdate) {
      throw new Error(
        `No AfnInventoryDailyUpdate found for SKU ID: ${skuId}. No update performed.\n`,
      );
    } else {
      try {
        const skuAfnTotalQuantity = latestUpdate.afnFulfillableQuantity;
        await db.Sku.update({ skuAfnTotalQuantity }, { where: { skuId } });
      } catch (updateError) {
        console.error('Error updating SKU AFN total quantity in the database:');
        throw new Error(
          `Error updating SKU AFN total quantity in the database: ${updateError}\n`,
        );
      }
    }
  } catch (error) {
    logMessage += `Error finding latest AfnInventoryDailyUpdate: ${error}\n`;
    console.error('Error finding latest AfnInventoryDailyUpdate:', error);
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  updateAfnQuantity,
};
