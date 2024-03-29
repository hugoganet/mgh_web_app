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
    const [asinSkuRecord, createdAsinSkuRecord] = await db.AsinSku.findOrcreate(
      {
        asinId: asinId,
        skuId: skuId,
      },
    );
    if (createdAsinSkuRecord) {
      eventBus.emit('recordCreated', {
        type: 'asinSku',
        action: 'asinSku_created',
        id: asinSkuRecord.asinSkuId,
      });
      logMessage += `Created new AsinSku record for ASIN: ${asin} and SKU: ${sku} in ${countryCode}\n`;
    } else {
      eventBus.emit('recordCreated', {
        type: 'asinSku',
        action: 'asinSku_found',
        id: asinSkuRecord.asinSkuId,
      });
      logMessage += `Error creating AsinSku record in processInventoryChunk : ${err}\n`;
    }
    return asinSkuRecord;
  } catch (error) {
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  findOrCreateAsinSkuRecord,
};
