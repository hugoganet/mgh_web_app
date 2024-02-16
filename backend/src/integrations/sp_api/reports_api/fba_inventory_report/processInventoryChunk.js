const db = require('../../../../api/models/index');
const { logger } = require('../../../../utils/logger');
const eventBus = require('../../../../utils/eventBus');
const { convertToEur } = require('../../../../utils/convertToEur.js');
const {
  checkSkuIsActive,
} = require('../../../../api/services/checkSkuIsActive.js');
const {
  updateAfnQuantity,
} = require('../../../../api/services/updateAfnQuantity.js');
const { addFnskuToSku } = require('../../../../api/services/addFnskuToSku.js');
const {
  automaticallyCreateAsinRecord,
} = require('../../../../api/services/automaticallyCreateAsinRecord.js');
const {
  automaticallyCreateMinSellingPriceRecord,
} = require('../../../../api/services/automaticallyCreateMinSellingPriceRecord.js');
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

    // Handle ASIN record
    const associatedAsinRecord = await findOrCreateAsinRecord(
      asin,
      countryCode,
      (createLog = true),
      logContext,
    );

    // Handle AsinSku record
    const asinSkuRecord = await findOrCreateAsinSkuRecord(
      associatedAsinRecord.asinId,
      skuRecord.skuId,
      countryCode,
      (createLog = true),
      logContext,
    );

    // Handle MinimumSellingPrice record
    const minimumSellingPriceRecord = await findOrCreateMinSellingPriceRecord(
      skuRecord.skuId,
      (createLog = true),
      logContext,
    );

    // Attempt to find or create a corresponding AfnInventoryDailyUpdate record in the database
    const [afnInventoryRecord, createdAfnInventoryRecord] =
      await db.AfnInventoryDailyUpdate.findOrCreate({
        where: { skuId: skuId },
        defaults: {
          skuId,
          sku,
          countryCode,
          currencyCode,
          actualPrice: skuAverageSellingPrice,
          afnFulfillableQuantity: skuAfnTotalQuantity,
          reportDocumentId,
        },
      });

    // If the record already existed, update the actualPrice and afnFulfillableQuantity fields
    if (!createdAfnInventoryRecord) {
      afnInventoryRecord.actualPrice = skuAverageSellingPrice;
      afnInventoryRecord.afnFulfillableQuantity = skuAfnTotalQuantity;
      afnInventoryRecord.reportDocumentId = reportDocumentId;
      await afnInventoryRecord.save();
      logMessage += `Updated existing AfnInventoryDailyUpdate record for skuId: ${skuId}.\n`;
    } else {
      logMessage += `Created new AfnInventoryDailyUpdate record for skuId: ${skuId}.\n`;
    }

    // Perform various database operations on the SKU record
    await checkSkuIsActive(skuId, createLog, logContext);
    logMessage += `Checked SKU activity for SKU ID: ${skuRecord.skuId}.\n`;

    await updateAfnQuantity(skuId, createLog, logContext);
    logMessage += `Updated AFN quantity for SKU ID: ${skuRecord.skuId}.\n`;

    await addFnskuToSku(skuId, fnsku, createLog, logContext);
    logMessage += `Added fnsku to SKU ID: ${skuRecord.skuId}.\n`;
  } catch (error) {
    console.error('Error processing inventory chunk:', error);
    logMessage += `Error processing inventory chunk: ${error}\n`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { processInventoryChunk };
