// Import required modules and libraries
const axios = require('axios');
const csvParser = require('csv-parser');
const { PassThrough, Transform } = require('stream');
const zlib = require('zlib');
const db = require('../../../api/models/index');
const marketplaces = require('../../../../src/config/marketplaces');

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
async function fetchAndProcessCsv(
  url,
  compressionAlgorithm,
  reportDocumentId,
  countryKeys,
  reportType,
) {
  // Retrieve the countryCode from the marketplaces configuration using the first countryKey
  const countryCode = marketplaces[countryKeys[0]].countryCode;
  const invalidSkus = []; // Array to store invalid SKUs

  try {
    // Make a GET request to the provided URL to receive the file as a stream
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    });

    // Choose the appropriate decompression stream based on the compression algorithm
    const decompressionStream = chooseDecompressionStream(compressionAlgorithm);

    // Create a transform stream to process each row of CSV data
    const transformStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        try {
          // Log the current chunk for debugging
          console.log(chunk);

          // Check if the SKU field exists and is a string, skip if invalid
          // If SKU is invalid, add it to the invalidSkus array
          if (!chunk['sku'] || typeof chunk['sku'] !== 'string') {
            invalidSkus.push({ sku: chunk['sku'], countryCode });
            // console.error('Invalid or missing SKU, skipping record:', chunk);
            callback();
            return;
          }

          // Push the SKU and countryCode for the next processing stage
          this.push({ sku: chunk['sku'], countryCode });
          callback();
        } catch (err) {
          callback(err);
        }
      },
    });

    // Pipe the data through the decompression stream, then CSV parser, then transform stream
    response.data
      .pipe(decompressionStream)
      .pipe(csvParser({ separator: '\t' }))
      .pipe(transformStream)
      .on('data', async ({ sku, countryCode }) => {
        try {
          // Find the corresponding SKU record from the database
          const skuRecord = await db.Sku.findOne({
            where: { sku, countryCode },
          });

          // Skip processing if the SKU record is not found and log the issue
          if (!skuRecord) {
            console.log(`SKU not found for ${sku} in ${countryCode}`);
            return;
          }

          // Construct the record for the database from the CSV row
          const record = {
            skuId: skuRecord.skuId, // Use skuId from the found SKU record
            actualPrice: parseFloat(chunk['your-price']),
            afnFulfillableQuantity: parseInt(
              chunk['afn-fulfillable-quantity'],
              10,
            ),
            reportDocumentId,
          };

          // Insert the constructed record into the database
          await db.AfnInventoryDailyUpdate.create(record);
        } catch (dbErr) {
          // Log any error that occurs during database insertion
          console.error('Error inserting data into database:', dbErr);
        }
      })
      .on('error', error => {
        // Log any error that occurs during stream processing
        console.error('Error processing data stream:', error);
      })
      .on('end', () => {
        if (invalidSkus.length > 0) {
          const message = `Invalid SKUs found: ${JSON.stringify(invalidSkus)}`;
          logAndCollect(message, reportType);
        }
        console.log('Data processing completed');
      });
  } catch (error) {
    // Log any error that occurs during data fetching
    console.error('Error fetching data:', error);
  }
}

/**
 * Chooses the appropriate decompression stream based on the compression algorithm.
 * @param {string|null} compressionAlgorithm - The compression algorithm used.
 * @return {stream.Transform} The decompression stream.
 */
function chooseDecompressionStream(compressionAlgorithm) {
  switch (compressionAlgorithm) {
    case 'GZIP':
      return zlib.createGunzip();
    case null:
    case undefined:
      return new PassThrough(); // No decompression needed
    default:
      throw new Error(
        `Unsupported compression algorithm: ${compressionAlgorithm}`,
      );
  }
}

module.exports = {
  fetchAndProcessCsv,
};
