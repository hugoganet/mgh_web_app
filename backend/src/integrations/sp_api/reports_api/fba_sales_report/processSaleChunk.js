const db = require('../../../../api/models/index');
const { logAndCollect } = require('../../logs/logger.js');
const { getFbaFeeType } = require('../../../../api/services/getFbaFeeType');
const { getFbaFees } = require('../../../../api/services/getFbaFees');
const {
  getAsinFromSkuId,
} = require('../../../../api/services/getAsinFromSkuId');
const {
  calculateGrossMargin,
} = require('../../../../utils/calculateGrossMargin.js');
const {
  calculateNetMargin,
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
 * @param {string} reportType - The type of report being processed.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<void>} - A promise that resolves when the sales data chunk is processed.
 */
async function processSalesChunk(
  chunk,
  reportDocumentId,
  reportType,
  createLog = false,
) {
  let logMessage = `Processing sales chunk for SKU: ${chunk['sku']}\n`;
  try {
    const countryCode = await mapSalesChannelToCountryCode(
      chunk['sales-channel'],
    );
    const sku = chunk['sku'];
    const salesData = {
      amazonSalesId: chunk['amazon-order-id'],
      salesShipCountryCode: chunk['ship-country'],
      salesItemCurrency: chunk['currency'],
      salesItemSellingPriceExc: chunk['item-price'],
      salesItemTax: chunk['item-tax'],
      salesSkuQuantity: chunk['quantity-shipped'],
      salesPurchaseDate: chunk['purchase-date'],
    };

    const skuRecord = await db.Sku.findOne({ where: { sku, countryCode } });

    if (!skuRecord) {
      logMessage += `Invalid SKU: ${sku}\n`;
      if (createLog) logAndCollect(logMessage, reportType);
      return;
    }

    const skuId = skuRecord.skuId;
    const asinId = await getAsinFromSkuId(skuId);
    const salesFbaFeeType = await getFbaFeeType(skuId);
    const salesFbaFees = await getFbaFees(asinId);

    // TODO get those data :
    // salesItemVatRate
    // salesGrossMarginPerItem
    // salesGrossMarginPercentagePerItem
    // salesNetMarginPerItem
    // salesNetMarginPercentagePerItem

    const salesFbaFee =
      salesFbaFees[salesFbaFeeType] * salesData.salesSkuQuantity;
    const salesCogsTotal =
      skuRecord.skuAcquisitionCostExc * salesData.salesSkuQuantity;
    const salesGrossMarginTotal = calculateGrossMargin(
      salesCogsTotal,
      salesData.salesItemSellingPriceExc,
    );
    const salesNetMarginTotal = calculateNetMargin(
      salesCogsTotal,
      salesData.salesItemSellingPriceExc,
      salesFbaFee,
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
      // salesItemVatRate,
      salesItemSellingPriceExc: salesData.salesItemSellingPriceExc,
      salesItemTax: salesData.salesItemTax,
      salesSkuQuantity: salesData.salesSkuQuantity,
      salesFbaFee,
      salesPurchaseDate: salesData.salesPurchaseDate,
      salesCogsTotal,
      salesGrossMarginTotal,
      // salesGrossMarginPerItem,
      // salesGrossMarginPercentagePerItem,
      salesNetMarginTotal,
      // salesNetMarginPerItem,
      // salesNetMarginPercentagePerItem,
      salesRoiPerItem,
      reportDocumentId,
    };

    await db.FbaSaleProcessed.create(record);

    logMessage += `Processed sales chunk for SKU: ${sku}\n`;
  } catch (error) {
    logMessage += `Error processing sales chunk: ${error}\n`;
    console.error('Error processing sales chunk:', error);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, reportType);
    }
  }
}

module.exports = { processSalesChunk };
