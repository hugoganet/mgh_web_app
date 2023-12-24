const axios = require('axios');
const csvParser = require('csv-parser');
const { Transform } = require('stream'); // To work with streams
const db = require('../../../api/models/index'); // Database models
const marketplaces = require('../../../config/marketplaces'); // Marketplace configuration
const { logAndCollect } = require('./logs/logAndCollect'); // Logging function
const {
  chooseDecompressionStream,
} = require('../chooseDecompressionStream.js');
const {
  checkSkuIsActive,
} = require('../../../api/services/checkSkuIsActive.js');

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
  const countryCode = marketplaces[countryKeys[0]].countryCode; // Retrieve the countryCode from the first countryKey
  const invalidSkus = []; // Array to store invalid SKUs

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
          // Extract necessary data from the chunk and pass it downstream
          const skuData = {
            sku: chunk['sku'],
            countryCode: countryCode,
            actualPrice: parseFloat(chunk['your-price']),
            afnFulfillableQuantity: parseInt(
              chunk['afn-fulfillable-quantity'],
              10,
            ),
          };
          this.push(skuData);
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
        async ({ sku, countryCode, actualPrice, afnFulfillableQuantity }) => {
          try {
            // Find corresponding SKU record in the database
            const skuRecord = await db.Sku.findOne({
              where: { sku, countryCode },
            });

            // If SKU not found, log and skip processing
            if (!skuRecord) {
              invalidSkus.push({ sku, countryCode });
              return;
            }

            // Construct the record for database insertion
            const record = {
              skuId: skuRecord.skuId,
              actualPrice,
              afnFulfillableQuantity,
              reportDocumentId,
            };

            checkSkuIsActive(skuRecord.skuId);
            // Insert the record into the database
            await db.AfnInventoryDailyUpdate.create(record);
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
          let tableString = 'Invalid SKUs:\nSKU\t\tCountryCode\n';
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
  fetchAndProcessInventoryReport,
};
