const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const { convertToEur } = require('../../utils/convertToEur');

/**
 * @description This function automatically creates a SKU record in the database if it does not exist.
 * @async
 * @function findOrCreateSkuRecord
 * @param {string} sku - The SKU for which to create a record.
 * @param {string} countryCode - The country code for which to create a record.
 * @param {string} currencyCode - The currency code for which to create a record.
 * @param {number} skuAfnTotalQuantity - The total AFN quantity for the SKU.
 * @param {number} skuAverageSellingPrice - The average selling price for the SKU.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 */
async function findOrCreateSkuRecord(
  sku,
  countryCode,
  currencyCode,
  skuAfnTotalQuantity,
  skuAverageSellingPrice,
  createLog = false,
  logContext = 'findOrCreateSkuRecord',
) {
  const today = new Date().toISOString().split('T')[0]; // Results in "YYYY-MM-DD"
  let logMessage = '';

  let convertedSellingPrice = skuAverageSellingPrice;

  if (currencyCode !== 'EUR') {
    convertedSellingPrice = await convertToEur(
      skuAverageSellingPrice,
      currencyCode,
      today,
      createLog,
      logContext,
    );
  }
  try {
    let skuRecord = await db.Sku.findOne({ where: { sku, countryCode } });
    if (skuRecord) {
      eventBus.emit('recordCreated', {
        type: 'sku',
        action: 'sku_found',
        id: skuRecord.skuId,
      });
      logMessage += `SKU record found for SKU: ${sku} on ${countryCode}, updating acquisition costs\n`;
    } else {
      logMessage += `SKU record not found for SKU: ${sku} on ${countryCode}, looking for similar SKU with another countryCode\n`;
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
        if (skuRecord) {
          eventBus.emit('recordCreated', {
            type: 'sku',
            action: 'sku_created',
            id: skuRecord.skuId,
          });
        }
        logMessage += `Created new SKU record with id: ${skuRecord.skuId} for SKU: ${sku} on ${countryCode}\n`;
      } else {
        logMessage += `No similar SKU found, exiting the script\n`;
        return;
      }
    }
    return skuRecord;
  } catch (err) {
    logMessage += `Error finding similar SKU or copying acquisition costs: ${err}\n`;
    throw err;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  findOrCreateSkuRecord,
};
