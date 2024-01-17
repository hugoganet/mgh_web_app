const db = require('../models');
const { logAndCollect } = require('../../integrations/sp_api/logs/logger');

/**
 * Updates the FNSKU for a given SKU record in the database.
 * @param {number} skuId - The ID of the SKU to update.
 * @param {string} fnsku - The new FNSKU value to set.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<db.Sku>} - The updated SKU record.
 * @throws Will throw an error if the SKU record cannot be found.
 */
const addFnskuToSku = async (skuId, fnsku, createLog = false) => {
  let logMessage = `Updating FNSKU for SKU ID: ${skuId}\n`;

  try {
    const skuRecord = await db.Sku.findByPk(skuId);

    if (!skuRecord) {
      const errorMessage = `No SKU found for SKU ID: ${skuId}`;
      logMessage += errorMessage + '\n';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const updatedRecord = await skuRecord.update({ fnsku });
    logMessage += `FNSKU (${fnsku}) updated for SKU ID: ${skuId}\n`;
    return updatedRecord;
  } catch (error) {
    logMessage += `Error updating FNSKU: ${error}\n`;
    console.error('Error updating FNSKU:', error);
    throw error;
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'AddFnskuToSku');
    }
  }
};

module.exports = {
  addFnskuToSku,
};
