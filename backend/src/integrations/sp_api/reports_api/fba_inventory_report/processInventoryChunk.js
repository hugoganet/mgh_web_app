const db = require('../../../../api/models/index');
const {
  checkSkuIsActive,
} = require('../../../../api/services/checkSkuIsActive.js');
const {
  updateAfnQuantity,
} = require('../../../../api/services/updateAfnQuantity.js');
const { addFnskuToSku } = require('../../../../api/services/addFnskuToSku.js');
const { logAndCollect } = require('../../logs/logger.js');

/**
 * @async
 * @function processInventoryChunk
 * @param {Object} chunk - A chunk of CSV data representing a row in the inventory report.
 * @param {string} reportDocumentId - The document ID of the report being processed.
 * @param {string} countryCode - The country code associated with the inventory data.
 * @param {string} currencyCode - The currency code associated with the inventory data.
 * @param {boolean} createLog - Whether to create a log of the process.
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
  createLog = false,
) {
  let logMessage = `Processing inventory chunk for SKU: ${chunk['sku']} on ${countryCode}\n`;
  try {
    const sku = chunk['sku'];
    const fnsku = chunk['fnsku'];
    const skuAfnTotalQuantity = parseInt(chunk['afn-fulfillable-quantity'], 10);
    const skuAverageSellingPrice = parseFloat(chunk['your-price']);

    // Find or create the SKU record in the database
    const [skuRecord, created] = await db.Sku.findOrCreate({
      where: { sku, countryCode },
      defaults: {
        sku,
        countryCode,
        fnsku,
        skuAcquisitionCostExc: 0,
        skuAcquisitionCostInc: 0,
        skuAfnTotalQuantity,
        skuAverageSellingPrice,
        currencyCode,
        skuAverageNetMargin: null,
        skuAverageNetMarginPercentage: null,
        skuAverageReturnOnInvestmentRate: null,
        skuAverageDailyReturnOnInvestmentRate: null,
        isActive: false,
        numberOfActiveDays: null,
        numberOfUnitSold: 0,
        skuAverageUnitSoldPerDay: null,
        skuRestockAlertQuantity: 1,
        skuIsTest: false,
      },
    });

    const skuId = skuRecord.skuId;

    if (created) {
      try {
        const similarSku = await db.Sku.findOne({
          where: {
            sku,
            countryCode: { [db.Sequelize.Op.ne]: countryCode },
          },
        });

        logMessage += `Created new SKU record: ${skuRecord.sku}\n`;

        if (similarSku) {
          skuRecord.skuAcquisitionCostExc = similarSku.skuAcquisitionCostExc;
          skuRecord.skuAcquisitionCostInc = similarSku.skuAcquisitionCostInc;
          await skuRecord.save();
          logMessage += `Copied acquisition costs for new SKU record.\n`;
        }
      } catch (err) {
        logMessage += `Error finding similar SKU or copying acquisition costs: ${err}\n`;
      }
    }

    // Attempt to find or create a corresponding AfnInventoryDailyUpdate record in the database
    try {
      const [inventoryRecord, createdAfnInventoryRecord] =
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
        inventoryRecord.actualPrice = skuAverageSellingPrice;
        inventoryRecord.afnFulfillableQuantity = skuAfnTotalQuantity;
        inventoryRecord.reportDocumentId = reportDocumentId;
        await inventoryRecord.save();
        logMessage += `Updated existing AfnInventoryDailyUpdate record for skuId: ${skuId}.\n`;
      } else {
        logMessage += `Created new AfnInventoryDailyUpdate record for skuId: ${skuId}.\n`;
      }
    } catch (err) {
      logMessage += `Error finding or creating AfnInventoryDailyUpdate record: ${err}\n`;
    }

    // Perform various database operations on the SKU record
    try {
      await checkSkuIsActive(skuId, createLog);
      logMessage += `Checked SKU activity for SKU ID: ${skuRecord.skuId}.\n`;
    } catch (err) {
      logMessage += `Error checking SKU activity: ${err}\n`;
    }

    try {
      await updateAfnQuantity(skuId, createLog);
      logMessage += `Updated AFN quantity for SKU ID: ${skuRecord.skuId}.\n`;
    } catch (err) {
      logMessage += `Error updating AFN quantity: ${err}\n`;
    }

    try {
      if (skuRecord.fnsku == null) {
        await addFnskuToSku(skuId, fnsku, createLog);
        logMessage += `Added fnsku to SKU ID: ${skuRecord.skuId}.\n`;
      }
    } catch (err) {
      logMessage += `Error adding fnsku to sku: ${err}\n`;
    }
  } catch (error) {
    console.error('Error processing inventory chunk:', error);
    logMessage += `Error processing inventory chunk: ${error}\n`;
  }

  if (createLog) {
    logAndCollect(logMessage, 'ProcessInventoryChunk');
  }
}

module.exports = { processInventoryChunk };
