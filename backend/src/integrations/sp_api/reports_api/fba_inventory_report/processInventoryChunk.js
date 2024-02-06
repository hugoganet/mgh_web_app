const db = require('../../../../api/models/index');
const {
  checkSkuIsActive,
} = require('../../../../api/services/checkSkuIsActive.js');
const {
  updateAfnQuantity,
} = require('../../../../api/services/updateAfnQuantity.js');
const { addFnskuToSku } = require('../../../../api/services/addFnskuToSku.js');
const { logger } = require('../../../../utils/logger');
const { convertToEur } = require('../../../../utils/convertToEur.js');
const {
  automaticallyCreateAsinRecord,
} = require('../../../../api/services/automaticallyCreateAsinRecord.js');

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
  let logMessage = `Processing inventory chunk for SKU: ${chunk['sku']} on ${countryCode}\n`;
  try {
    const sku = chunk['sku'];
    const fnsku = chunk['fnsku'];
    const asin = chunk['asin'];
    const skuAfnTotalQuantity = parseInt(chunk['afn-fulfillable-quantity'], 10);
    const skuAverageSellingPrice = parseFloat(chunk['your-price']);
    const today = new Date().toISOString().split('T')[0]; // Results in "YYYY-MM-DD"

    let convertedSellingPrice = skuAverageSellingPrice;
    if (currencyCode !== 'EUR') {
      convertedSellingPrice = await convertToEur(
        skuAverageSellingPrice,
        currencyCode,
        today,
      );
    }

    let skuRecord = await db.Sku.findOne({ where: { sku, countryCode } });

    if (!skuRecord) {
      logMessage += `SKU record not found for SKU: ${sku} on ${countryCode}, looking for similar SKU with another countryCode\n`;
      try {
        const similarSku = await db.Sku.findOne({
          where: {
            sku,
            countryCode: { [db.Sequelize.Op.ne]: countryCode },
          },
        });
        if (similarSku) {
          skuAcquisitionCostExc = similarSku.skuAcquisitionCostExc;
          skuAcquisitionCostInc = similarSku.skuAcquisitionCostInc;
          logMessage += `Found similar SKU: ${similarSku.sku} on ${similarSku.countryCode}, copying acquisition costs\n`;
        } else {
          logMessage += `No similar SKU found, exiting the script\n`;
          return;
        }
        // create new SKU record
        skuRecord = await db.Sku.create({
          sku,
          countryCode,
          fnsku: null,
          skuAcquisitionCostExc,
          skuAcquisitionCostInc,
          skuAfnTotalQuantity,
          skuAverageSellingPrice: convertedSellingPrice,
          skuAverageNetMargin: null,
          skuAverageNetMarginPercentage: null,
          skuAverageReturnOnInvestmentRate: null,
          skuAverageDailyReturnOnInvestmentRate: null,
          isActive: true,
          numberOfActiveDays: 1,
          numberOfUnitSold: 0,
          skuAverageUnitSoldPerDay: 0,
          skuRestockAlertQuantity: 1,
          skuIsTest: false,
        });
        logMessage += `Created new SKU record: ${JSON.stringify(
          skuRecord,
          '',
          2,
        )}\n`;
      } catch (err) {
        logMessage += `Error finding similar SKU or copying acquisition costs: ${err}\n`;
        throw err;
      }
      // If the SKU record has just been created, check if an ASIN exist for this marketplace.
      logMessage += `Checking if an ASIN record exists for ${asin} in ${countryCode} before creating one.\n`;
      let associatedAsin = await db.Asin.findOne({
        where: {
          asin,
          countryCode,
        },
      });
      // TODO : Find out why the associatedAsin is not found
      if (associatedAsin) {
        logMessage += `Associated ASIN found for ${asin} in ${countryCode}, creating AsinSku record\n`;
      } else {
        try {
          associatedAsin = await automaticallyCreateAsinRecord(
            asin,
            (marketplaceId = null),
            countryCode,
            createLog,
          );
          logMessage += `No associated ASIN found for ${asin} in ${countryCode}, creating one : ${JSON.stringify(
            associatedAsin,
            '',
            2,
          )}\n`;
        } catch (err) {
          logMessage += `Error creating associated ASIN: ${err}\n`;
          throw err;
        }
      }
      // Create AsinSku record
      try {
        logMessage += `Creating AsinSku record for asin: ${asin} and sku: ${sku} in ${countryCode}\n`;
        await db.AsinSku.create({
          asinId: associatedAsin.asinId,
          skuId: skuRecord.skuId,
        });
      } catch (err) {
        logMessage += `Error creating AsinSku record in processInventoryChunk : ${err}\n`;
        throw err;
      }
    }

    const skuId = skuRecord.skuId;

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
  } finally {
    if (createLog) {
      logger(logMessage, 'processInventoryChunk');
    }
  }
}

module.exports = { processInventoryChunk };
