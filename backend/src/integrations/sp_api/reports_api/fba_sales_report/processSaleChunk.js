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
  mapSalesChannelOrCountryCode,
} = require('../../../../utils/mapSalesChannelOrCountryCode.js');
const { convertToEur } = require('../../../../utils/convertToEur');

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
      countryCode = await mapSalesChannelOrCountryCode(
        chunk['sales-channel'],
        'salesChannelToCountryCode',
      );
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

    let convertedSellingPrice = salesData.salesItemSellingPriceExc;
    if (salesData.salesItemCurrency !== 'EUR') {
      convertedSellingPrice = await convertToEur(
        salesData.salesItemSellingPriceExc,
        salesData.salesItemCurrency,
        salesData.salesPurchaseDate,
      );
    }

    let skuRecord = await db.Sku.findOne({ where: { sku, countryCode } });

    if (!skuRecord) {
      logMessage += `SKU record not found for ${sku} in ${countryCode}\n`;
      try {
        logMessage += `Looking for similar SKU record for ${sku} not in ${countryCode}\n`;
        const similarSku = await db.Sku.findOne({
          where: {
            sku,
            countryCode: { [db.Sequelize.Op.ne]: countryCode },
          },
        });
        logMessage += `Created new SKU record: ${sku} for ${countryCode}\n`;
        if (similarSku) {
          skuAcquisitionCostExc = similarSku.skuAcquisitionCostExc;
          skuAcquisitionCostInc = similarSku.skuAcquisitionCostInc;
          skuAfnTotalQuantity = similarSku.skuAfnTotalQuantity;
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
          skuAverageUnitSoldPerDay: salesData.salesSkuQuantity,
          skuRestockAlertQuantity: 1,
          skuIsTest: false,
        });
      } catch (err) {
        logMessage += `Error finding similar SKU or creating new SKU: ${err}\n`;
        throw err; // rethrow the error to be caught by the outer try-catch
      }
    }

    const skuId = skuRecord.skuId;

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
    // console.error('Error processing sales chunk:', error);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'ProcessSalesChunk');
    }
  }
}

module.exports = { processSalesChunk };
