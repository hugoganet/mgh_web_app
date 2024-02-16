const { logger } = require('../../../../utils/logger');
const {
  checkSkuIsActive,
} = require('../../../../api/services/checkSkuIsActive.js');
const {
  updateAfnQuantity,
} = require('../../../../api/services/updateAfnQuantity.js');
const { addFnskuToSku } = require('../../../../api/services/addFnskuToSku.js');
const {
  findOrCreateSkuRecord,
} = require('../../../../api/services/findOrCreateSkuRecord.js');
const {
  findOrCreateAsinRecord,
} = require('../../../../api/services/findOrCreateAsinRecord.js');
const {
  findOrCreateAsinSkuRecord,
} = require('../../../../api/services/findOrCreateAsinSkuRecord.js');
const {
  findOrCreateMinSellingPriceRecord,
} = require('../../../../api/services/findOrCreateMinSellingPriceRecord.js');
const {
  findOrCreateAfnInventoryDailyUpdateRecord,
} = require('../../../../api/services/findOrCreateAfnInventoryDailyUpdateRecord.js');

/**
 * @async
 * @function processInventoryChunk
 * @param {Object} chunk - A chunk of CSV data representing a row in the inventory report.
 * @param {string} reportDocumentId - The document ID of the report being processed.
 * @param {string} countryCode - The country code associated with the inventory data.
 * @param {string} currencyCode - The currency code associated with the inventory data.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<Object>} - A promise that resolves to the updated or created AfnInventoryDailyUpdate record.
 * @description This function takes a chunk of data from an inventory report CSV, processes it to extract
 *              necessary information, and performs various asynchronous database operations including
 *              creating or updating SKU records and inventory update records. It handles the complexities
 *              of asynchronous database interactions and ensures all steps are completed for each chunk of data.
 */
async function processInventoryChunk(
  chunk,
  reportDocumentId,
  countryCode,
  currencyCode,
  createLog,
  logContext,
) {
  let logMessage = ``;

  try {
    const sku = chunk['sku'];
    const fnsku = chunk['fnsku'];
    const asin = chunk['asin'];
    const skuAfnTotalQuantity = parseInt(chunk['afn-fulfillable-quantity'], 10);
    const skuAverageSellingPrice = parseFloat(chunk['your-price']);

    // Handle SKU record
    const skuRecord = await findOrCreateSkuRecord(
      sku,
      countryCode,
      currencyCode,
      skuAfnTotalQuantity,
      skuAverageSellingPrice,
      (createLog = true),
      logContext,
    );
    const skuId = skuRecord.skuId;

    // Handle ASIN record
    const associatedAsinRecord = await findOrCreateAsinRecord(
      asin,
      countryCode,
      (createLog = true),
      logContext,
    );

    // Handle AsinSku record
    await findOrCreateAsinSkuRecord(
      associatedAsinRecord.asinId,
      skuId,
      countryCode,
      (createLog = true),
      logContext,
    );

    // Handle MinimumSellingPrice record
    await findOrCreateMinSellingPriceRecord(
      skuId,
      (createLog = true),
      logContext,
    );

    // Handle AfnInventoryDailyUpdate record
    await findOrCreateAfnInventoryDailyUpdateRecord(
      skuId,
      sku,
      countryCode,
      currencyCode,
      skuAverageSellingPrice,
      skuAfnTotalQuantity,
      reportDocumentId,
      (createLog = true),
      logContext,
    );

    // Perform various database operations on the SKU record
    await checkSkuIsActive(skuId, createLog, logContext);
    logMessage += `Checked SKU activity for SKU ID: ${skuId}.\n`;

    await updateAfnQuantity(skuId, createLog, logContext);
    logMessage += `Updated AFN quantity for SKU ID: ${skuId}.\n`;

    await addFnskuToSku(skuId, fnsku, createLog, logContext);
    logMessage += `Added fnsku to SKU ID: ${skuId}.\n`;
  } catch (error) {
    console.error('Error processInventoryChunk:', error);
    logMessage += `Error in processInventoryChunk: ${error}\n`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { processInventoryChunk };
