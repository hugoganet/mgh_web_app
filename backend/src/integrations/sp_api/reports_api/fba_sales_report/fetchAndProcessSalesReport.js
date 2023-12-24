const axios = require('axios');
const csvParser = require('csv-parser');
const { Transform } = require('stream');
const db = require('../../../../api/models/index');
const { logAndCollect } = require('../logs/logAndCollect');
const {
  chooseDecompressionStream,
} = require('../../chooseDecompressionStream');
const {
  mapSalesChannelToCountryCode,
} = require('../../../../utils/mapSalesChannelToCountryCode.js');
const { getFbaFeeType } = require('../../../../api/services/getFbaFeeType');
const { getFbaFees } = require('../../../../api/services/getFbaFees');
const {
  getAsinFromSkuId,
} = require('../../../../api/services/getAsinFromSkuId');
const {
  calculateGrossMargin,
} = require('../../../../utils/calculateGrossMargin');

/**
 * Fetches and processes a CSV file from a given URL.
 *
 * @async
 * @param {string} url - The URL of the CSV file.
 * @param {string|null} compressionAlgorithm - The compression algorithm used (e.g., 'GZIP'), or null if uncompressed.
 * @param {string} reportDocumentId - The document ID associated with the report.
 * @param {string} reportType - The type of report being processed.
 * @return {Promise<void>} - A promise that resolves when the CSV file has been fetched and processed.
 */
async function fetchAndProcessSalesReport(
  url,
  compressionAlgorithm,
  reportDocumentId,
  reportType,
) {
  const invalidSkus = [];

  try {
    // Make a GET request to receive the file as a stream
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    });

    // Choose the appropriate decompression stream based on the algorithm
    const decompressionStream = chooseDecompressionStream(compressionAlgorithm);

    // Create a transform stream to process each row of CSV data
    const transformStream = new Transform({
      objectMode: true,
      async transform(chunk, encoding, callback) {
        try {
          const countryCode = await mapSalesChannelToCountryCode(
            chunk['sales-channel'],
          );

          const salesData = {
            sku: chunk['sku'], // Map to 'sku' field in the model
            countryCode,
            amazonSalesId: chunk['amazon-order-id'], // Map to 'amazonSalesId' field in the model
            salesShipCountryCode: chunk['ship-country'], // Map to 'salesShipCountryCode' field in the model
            salesItemCurrency: chunk['currency'], // Map to 'salesItemCurrency' field in the model
            salesItemSellingPriceExc: parseFloat(chunk['item-price']), // Map to 'salesItemSellingPriceExc' field in the model
            salesItemTax: parseFloat(chunk['item-tax']), // Map to 'salesItemTax' field in the model
            salesSkuQuantity: parseInt(chunk['quantity-shipped'], 10), // Map to 'salesSkuQuantity' field in the model
            salesPurchaseDate: new Date(chunk['purchase-date']), // Map to 'salesPurchaseDate' field in the model
          };
          this.push(salesData);
          callback();
        } catch (err) {
          callback(err);
        }
      },
    });

    // Set up the data processing pipeline
    response.data
      .pipe(decompressionStream) // Decompress the data
      .pipe(csvParser({ separator: '\t' })) // Parse CSV data
      .pipe(transformStream) // Transform each row
      .on(
        'data',
        async ({
          sku,
          countryCode,
          amazonSalesId,
          salesShipCountryCode,
          salesItemCurrency,
          salesItemSellingPriceExc,
          salesItemTax,
          salesSkuQuantity,
          salesPurchaseDate,
        }) => {
          try {
            const skuRecord = await db.Sku.findOne({
              where: { sku, countryCode },
            });

            if (!skuRecord) {
              invalidSkus.push({ sku, countryCode });
              return;
            }

            const salesItemVatRate = (
              salesItemTax / salesItemSellingPriceExc
            ).toFixed(2);

            const asinId = await getAsinFromSkuId(skuRecord.skuId);

            const salesFbaFeeType = await getFbaFeeType(skuRecord.skuId);

            const salesFbaFee = await getFbaFees(asinId);

            const salesGrossMarginTotal = calculateGrossMargin(
              skuRecord.skuAcquisitionCostExc,
              salesItemSellingPriceExc,
            );
            console.log('salesGrossMarginTotal', salesGrossMarginTotal);

            // Construct the record for database insertion
            const record = {
              skuId: skuRecord.skuId,
              amazonSalesId,
              salesShipCountryCode,
              salesItemCurrency,
              salesItemVatRate,
              salesItemSellingPriceExc,
              salesItemTax,
              salesSkuQuantity,
              salesFbaFee: salesFbaFee[salesFbaFeeType],
              salesPurchaseDate,
              salesCogs: skuRecord.skuAcquisitionCostExc,
              salesGrossMarginTotal,
              reportDocumentId,
            };

            // Insert the record into the database
            await db.FbaSaleProcessed.create(record);
          } catch (dbErr) {
            console.error('Error inserting data into database:', dbErr);
          }
        },
      )
      .on('error', error => {
        console.error('Error processing data stream:', error);
      })
      .on('end', () => {
        // Log invalid SKUs at the end of processing
        if (invalidSkus.length > 0) {
          let tableString = 'Invalid SKUs:\nSKU\t\tCountry Code\n';
          invalidSkus.forEach(({ sku, countryCode }) => {
            tableString += `${sku}\t\t${countryCode}\n`;
          });
          logAndCollect(tableString, reportType);
        }
        console.log('Data processing completed');
      });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

module.exports = {
  fetchAndProcessSalesReport,
};
