const axios = require('axios');
const csvParser = require('csv-parser');
const { Transform } = require('stream'); // To work with streams
const db = require('../../../../api/models/index'); // Database models
const marketplaces = require('../../../../config/marketplaces.js'); // Marketplace configuration
// const { logAndCollect } = require('../logs/logAndCollect.js'); // Logging function
const {
  chooseDecompressionStream,
} = require('../../chooseDecompressionStream.js');
const {
  checkSkuIsActive,
} = require('../../../../api/services/checkSkuIsActive.js');
const {
  updateAfnQuantity,
} = require('../../../../api/services/updateAfnQuantity.js');
const { addFnskuToSku } = require('../../../../api/services/addFnskuToSku.js');
const { preProcessCsvRow } = require('./preProcessCsvRow.js');

/**
 * Fetches and processes a CSV file from a given URL.
 * @async
 * @param {string} url - The URL of the CSV file.
 * @param {string|null} compressionAlgorithm - The compression algorithm used (e.g., 'GZIP'), or null if uncompressed.
 * @param {string} reportDocumentId - The document ID associated with the report.
 * @param {string[]} countryKeys - The country keys to associate with the report.
 * @param {string} reportType - The type of report being processed.
 * @return {Promise<void>} - A promise that resolves when the CSV file has been fetched and processed.
 */
async function fetchAndProcessInventoryReport(
  url,
  compressionAlgorithm,
  reportDocumentId,
  countryKeys,
  reportType,
) {
  const countryCode = marketplaces[countryKeys[0]].countryCode;
  const currencyCode = marketplaces[countryKeys[0]].currencyCode;
  const createdSkus = [];

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
      transform(chunk, encoding, callback) {
        try {
          const processedChunk = preProcessCsvRow(chunk);
          this.push(processedChunk);
          callback();
        } catch (err) {
          callback(err);
        }
      },
    });

    // Set up the data processing pipeline
    response.data
      .pipe(decompressionStream) // Decompress the data
      .pipe(csvParser({ separator: '\t', escape: '"', quote: '' })) // Parse CSV data
      .pipe(transformStream) // Transform each row
      .on('data', async chunk => {
        try {
          const sku = chunk['sku'];

          // Find or create the SKU record in the database
          const [skuRecord, created] = await db.Sku.findOrCreate({
            where: { sku, countryCode },
            defaults: {
              sku,
              countryCode,
              fnsku: chunk['fnsku'],
              skuAcquisitionCostExc: 0,
              skuAcquisitionCostInc: 0,
              skuAfnTotalQuantity: parseInt(
                chunk['afn-fulfillable-quantity'],
                10,
              ),
              skuAverageSellingPrice: parseFloat(chunk['your-price']),
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
          // If the record was created, find another SKU with the same sku to copy acquisition costs
          if (created) {
            const similarSku = await db.Sku.findOne({
              where: {
                sku,
                countryCode: { [db.Sequelize.Op.ne]: countryCode }, // Not the same countryCode
              },
            });
            // console.log(`created sku with skuId: ${skuRecord.skuId}
            //   sku : ${sku}
            //   countryCode : ${countryCode}`);

            // If a similar SKU is found, copy the acquisition cost values
            if (similarSku) {
              skuRecord.skuAcquisitionCostExc =
                similarSku.skuAcquisitionCostExc;
              skuRecord.skuAcquisitionCostInc =
                similarSku.skuAcquisitionCostInc;
              await skuRecord.save();
            }
          }

          // If SKU not found, log it as invalid
          if (!skuRecord) {
            createdSkus.push({ sku, countryCode });
          }

          // Check SKU activity and update AFN quantity if SKU exists
          if (skuRecord) {
            checkSkuIsActive(skuRecord.skuId);
            updateAfnQuantity(skuRecord.skuId);
          }

          // Add fnsku to sku if not already present
          if (skuRecord.fnsku == null) {
            addFnskuToSku(skuRecord.skuId, fnsku);
          }

          // Attempt to find or create a corresponding AfnInventoryDailyUpdate record in the database
          const [inventoryRecord, createdAfnInventoryRecord] =
            await db.AfnInventoryDailyUpdate.findOrCreate({
              where: { skuId: skuRecord.skuId },
              defaults: {
                skuId: skuRecord.skuId,
                sku,
                countryCode,
                currencyCode,
                actualPrice: parseFloat(chunk['your-price']),
                afnFulfillableQuantity: parseInt(
                  chunk['afn-fulfillable-quantity'],
                  10,
                ),
                reportDocumentId,
              },
            });

          // Update the fields if the record exists
          if (!createdAfnInventoryRecord) {
            inventoryRecord.actualPrice = parseFloat(chunk['your-price']);
            inventoryRecord.afnFulfillableQuantity = parseInt(
              chunk['afn-fulfillable-quantity'],
              10,
            );
            inventoryRecord.reportDocumentId = reportDocumentId;
            await inventoryRecord.save();
          }
        } catch (dbErr) {
          console.error('Error inserting data into database:', dbErr);
        }
      })
      .on('error', error => {
        console.error('Error processing data stream:', error);
      })
      .on('end', () => {
        // Log invalid SKUs at the end of processing
        /*  if (createdSkus.length > 0) {
          let tableString = 'Invalid SKUs:\nSKU\t\tCountryCode\n';
          createdSkus.forEach(({ sku, countryCode }) => {
            tableString += `${sku}\t\t${countryCode}\n`;
          });
          console.log(tableString);
          logAndCollect(tableString, reportType);
        } */
        console.log('Data processing completed');
      });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

module.exports = {
  fetchAndProcessInventoryReport,
};
