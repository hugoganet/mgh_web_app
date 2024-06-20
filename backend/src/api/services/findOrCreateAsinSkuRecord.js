const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');

/**
 * @description This function finds or creates an ASIN-SKU record in the database if it does not exist.
 * @async
 * @function findOrCreateAsinSkuRecord
 * @param {string} asinId - The ASIN ID for which to create a record.
 * @param {string} skuId - The SKU ID for which to create a record.
 * @param {string} countryCode - The country code for which to create a record.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 */
async function findOrCreateAsinSkuRecord(
  asinId,
  skuId,
  countryCode,
  createLog = false,
  logContext,
) {
  let logMessage = '';
  try {
    logMessage += `findOrCreateAsinSkuRecord for ASIN: ${asinId} and SKU: ${skuId} in ${countryCode}\n`;
    const [asinSkuRecord, createdAsinSkuRecord] = await db.AsinSku.findOrCreate(
      {
        where: {
          asinId: asinId,
          skuId: skuId,
        },
      },
    );

    if (createdAsinSkuRecord) {
      eventBus.emit('recordCreated', {
        type: 'asinSku',
        action: 'asinSku_created',
        id: asinSkuRecord.asinSkuId,
      });
      logMessage += `Created new AsinSku record for ASIN: ${asinId} and SKU: ${skuId} in ${countryCode}\n`;
    } else {
      eventBus.emit('recordCreated', {
        type: 'asinSku',
        action: 'asinSku_found',
        id: asinSkuRecord.asinSkuId,
      });
      logMessage += `Found existing AsinSku record for ASIN: ${asinId} and SKU: ${skuId} in ${countryCode}\n`;
    }

    return asinSkuRecord;
  } catch (error) {
    logMessage += `Error creating or finding AsinSku record: ${error.message}\n`;
    console.error(error); // Log the error for debugging purposes
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  findOrCreateAsinSkuRecord,
};
