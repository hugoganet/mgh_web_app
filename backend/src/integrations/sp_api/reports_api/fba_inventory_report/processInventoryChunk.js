const db = require('../../../../api/models/index');
const {
  checkSkuIsActive,
} = require('../../../../api/services/checkSkuIsActive.js');
const {
  updateAfnQuantity,
} = require('../../../../api/services/updateAfnQuantity.js');
const { addFnskuToSku } = require('../../../../api/services/addFnskuToSku.js');

/**
 * @async
 * @function processInventoryChunk
 * @param {Object} chunk - A chunk of CSV data representing a row in the inventory report.
 * @param {string} reportDocumentId - The document ID of the report being processed.
 * @param {string} countryCode - The country code associated with the inventory data.
 * @param {string} currencyCode - The currency code associated with the inventory data.
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
) {
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

    // If the record was created, find another SKU with the same sku to copy acquisition costs
    if (created) {
      const similarSku = await db.Sku.findOne({
        where: {
          sku,
          countryCode: { [db.Sequelize.Op.ne]: countryCode },
        },
      });

      if (similarSku) {
        skuRecord.skuAcquisitionCostExc = similarSku.skuAcquisitionCostExc;
        skuRecord.skuAcquisitionCostInc = similarSku.skuAcquisitionCostInc;
        await skuRecord.save();
      }
    }

    // Check SKU activity and update AFN quantity if SKU exists
    if (skuRecord) {
      checkSkuIsActive(skuId);
      updateAfnQuantity(skuId);
    }

    // Add fnsku to sku if not already present
    if (skuRecord.fnsku == null) {
      addFnskuToSku(skuId, fnsku);
    }

    // Attempt to find or create a corresponding AfnInventoryDailyUpdate record in the database
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

    // Update the fields in AfnInventoryDailyUpdate if the record exists
    if (!createdAfnInventoryRecord) {
      // console.log(
      //   `Updating existing AfnInventoryDailyUpdate record for skuId: ${skuId}...`,
      // );
      inventoryRecord.actualPrice = skuAverageSellingPrice;
      inventoryRecord.afnFulfillableQuantity = skuAfnTotalQuantity;
      inventoryRecord.reportDocumentId = reportDocumentId;
      await inventoryRecord.save();
    } else {
      // console.log(
      //   `Creating new AfnInventoryDailyUpdate record for skuId: ${skuId}...`,
      // );
    }

    return inventoryRecord; // Return the updated or created inventory record
  } catch (error) {
    console.error('Error processing inventory chunk:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

module.exports = { processInventoryChunk };
