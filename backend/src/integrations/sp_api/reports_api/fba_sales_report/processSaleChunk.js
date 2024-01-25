const db = require('../../../../api/models/index');
const { logAndCollect } = require('../../logs/logger.js');
const { getFbaFeeType } = require('../../../../api/services/getFbaFeeType');
const { getFbaFees } = require('../../../../api/services/getFbaFees');
const {
  getAsinFromSkuId,
} = require('../../../../api/services/getAsinFromSkuId');
const {
  calculateGrossMargin,
  calculateGrossMarginPercentage,
} = require('../../../../utils/calculateGrossMargin.js');
const {
  calculateNetMargin,
  calculateNetMarginPercentage,
} = require('../../../../utils/calculateNetMargin.js');
const { calculateRoi } = require('../../../../utils/calculateRoi.js');
const {
  mapSalesChannelToCountryCode,
} = require('../../../../utils/mapSalesChannelToCountryCode.js');

/**
 * Processes a chunk of sales data from the CSV file.
 * @async
 * @param {Object} chunk - A chunk of CSV data representing a row in the sales report.
 * @param {string} reportDocumentId - The document ID of the report being processed.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<void>} - A promise that resolves when the sales data chunk is processed.
 */
async function processSalesChunk(chunk, reportDocumentId, createLog = false) {
  let logMessage = `Processing sales chunk for SKU: ${chunk['sku']}\n`;
  try {
    let countryCode;
    let asinId;
    let salesFbaFeeType;
    let salesFbaFees;

    try {
      countryCode = await mapSalesChannelToCountryCode(chunk['sales-channel']);
    } catch (err) {
      logMessage += `Error mapping sales channel (${chunk['sales-channel']}) to country code: ${err.message}\n`;
      throw new Error(
        `Error mapping sales channel to country code: ${err.message}`,
      );
    }

    const sku = chunk['sku'];
    const salesData = {
      amazonSalesId: chunk['amazon-order-id'],
      salesShipCountryCode: chunk['ship-country'],
      salesItemCurrency: chunk['currency'],
      salesItemSellingPriceExc: parseFloat(chunk['item-price']),
      salesItemTax: parseFloat(chunk['item-tax']),
      salesSkuQuantity: parseInt(chunk['quantity-shipped'], 10),
      salesPurchaseDate: new Date(chunk['purchase-date']),
    };

    // Find or create the SKU record in the database
    const [skuRecord, created] = await db.Sku.findOrCreate({
      where: { sku, countryCode },
      defaults: {
        sku,
        countryCode,
        fnsku: null,
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
          try {
            await skuRecord.save();
            logMessage += `Copied acquisition costs for new SKU record.\n`;
          } catch (err) {
            logMessage += `Error saving new SKU record: ${err.message}\n`;
          }
        }
      } catch (err) {
        logMessage += `Error finding similar SKU or copying acquisition costs: ${err}\n`;
      }
    }

    try {
      asinId = await getAsinFromSkuId(skuId);
    } catch (err) {
      logMessage += `Error fetching ASIN from SKU ID: ${err.message}\n`;
    }
    try {
      salesFbaFeeType = await getFbaFeeType(skuId);
    } catch (err) {
      logMessage += `Error fetching FBA fee type: ${err.message}\n`;
    }
    try {
      salesFbaFees = await getFbaFees(asinId);
    } catch (err) {
      logMessage += `Error fetching FBA fees: ${err.message}\n`;
    }

    const salesSellingPriceExcPerItem =
      salesData.salesItemSellingPriceExc / salesData.salesSkuQuantity;

    const salesFbaFee =
      salesFbaFees[salesFbaFeeType] * salesData.salesSkuQuantity;
    const salesFbaFeePerItem = salesFbaFees[salesFbaFeeType];

    const salesCogs =
      skuRecord.skuAcquisitionCostExc * salesData.salesSkuQuantity;
    const salesCogsPerItem = skuRecord.skuAcquisitionCostExc;

    const salesGrossMarginTotal = calculateGrossMargin(
      salesCogs,
      salesData.salesItemSellingPriceExc,
    );
    const salesGrossMarginPerItem =
      salesGrossMarginTotal / salesData.salesSkuQuantity;
    const salesGrossMarginPercentagePerItem = calculateGrossMarginPercentage(
      salesCogsPerItem,
      salesSellingPriceExcPerItem,
    );

    const salesNetMarginTotal = calculateNetMargin(
      salesCogs,
      salesData.salesItemSellingPriceExc,
      salesFbaFee,
    );
    const salesNetMarginPerItem =
      salesNetMarginTotal / salesData.salesSkuQuantity;
    const salesNetMarginPercentagePerItem = calculateNetMarginPercentage(
      salesCogsPerItem,
      salesSellingPriceExcPerItem,
      salesFbaFeePerItem,
    );

    const salesRoiPerItem = calculateRoi(
      skuRecord.skuAcquisitionCostExc,
      salesNetMarginTotal / salesData.salesSkuQuantity,
    );

    // Construct the record for database insertion
    const record = {
      skuId,
      countryCode,
      amazonSalesId: salesData.amazonSalesId,
      salesShipCountryCode: salesData.salesShipCountryCode,
      salesItemCurrency: salesData.salesItemCurrency,
      salesItemSellingPriceExc: salesData.salesItemSellingPriceExc,
      salesItemTax: salesData.salesItemTax,
      salesSkuQuantity: salesData.salesSkuQuantity,
      salesFbaFee,
      salesPurchaseDate: salesData.salesPurchaseDate,
      salesCogs,
      salesGrossMarginTotal,
      salesGrossMarginPerItem,
      salesGrossMarginPercentagePerItem,
      salesNetMarginTotal,
      salesNetMarginPerItem,
      salesNetMarginPercentagePerItem,
      salesRoiPerItem,
      reportDocumentId,
    };

    try {
      await db.FbaSaleProcessed.create(record);
    } catch (err) {
      logMessage += `Error creating FbaSaleProcessed record: ${err.message}\n`;
      throw new Error(`Error creating FbaSaleProcessed record: ${err.message}`);
    }
    logMessage += `Processed sales chunk for SKU: ${sku} done\n`;
  } catch (error) {
    logMessage += `Error processing sales chunk: ${error.message}\n`;
    console.error('Error processing sales chunk:', error);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'ProcessSalesChunk');
    }
  }
}

module.exports = { processSalesChunk };
