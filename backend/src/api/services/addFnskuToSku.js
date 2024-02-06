const db = require('../models');
const { logger } = require('../../utils/logger');

/**
 * Updates the FNSKU for a given SKU record in the database.
 * @param {number} skuId - The ID of the SKU to update.
 * @param {string} fnsku - The new FNSKU value to set.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<db.Sku>} - The updated SKU record.
 * @throws Will throw an error if the SKU record cannot be found.
 */
async function addFnskuToSku(
  skuId,
  fnsku,
  createLog = false,
  logContext = 'addFnskuToSku',
) {
  try {
    const skuRecord = await db.Sku.findByPk(skuId);

    if (!skuRecord) {
      console.error(`No SKU found for SKU ID: ${skuId}`);
      throw new Error(`No SKU found for SKU ID: ${skuId}`);
    }

    const updatedRecord = await skuRecord.update({ fnsku });
    return updatedRecord;
  } catch (error) {
    if (createLog) {
      logger(`Error updating FNSKU: ${error}`, logContext);
    }
    console.error('Error updating FNSKU:', error);
    throw new Error(`Error updating FNSKU: ${error}`);
  }
}

module.exports = {
  addFnskuToSku,
};
