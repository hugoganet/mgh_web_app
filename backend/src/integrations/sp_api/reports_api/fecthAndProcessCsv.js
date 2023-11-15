const axios = require('axios');
const csvParser = require('csv-parser');
const { PassThrough, Transform } = require('stream');
const zlib = require('zlib');
const db = require('../../../api/models/index');

/**
 * Fetches and processes a CSV file from a given URL.
 * @async
 * @param {string} url - The URL of the CSV file.
 * @param {string|null} compressionAlgorithm - The compression algorithm used (e.g., 'GZIP'), or null if uncompressed.
 * @param {string} reportDocumentId - The document ID associated with the report.
 */
async function fetchAndProcessCSV(url, compressionAlgorithm, reportDocumentId) {
  try {
    // Send a GET request to the URL and receive the response as a stream
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    });

    // Determine the appropriate decompression stream based on the compression algorithm
    const decompressionStream = chooseDecompressionStream(compressionAlgorithm);

    // Create a transform stream to process each row of CSV data
    const transformStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        try {
          // Log the chunk to see the parsed data
          console.log(chunk);

          // Check if SKU is present and valid
          if (!chunk['sku'] || typeof chunk['sku'] !== 'string') {
            console.error('Invalid or missing SKU, skipping record:', chunk);
            callback();
            return;
          }
          // Construct the record for the database from the CSV row
          const record = {
            sku: chunk['sku'],
            countryCode: 'FR', // Default country code
            actualPrice: parseFloat(chunk['your-price']),
            afnFulfillableQuantity: parseInt(
              chunk['afn-fulfillable-quantity'],
              10,
            ),
            reportDocumentId: reportDocumentId,
          };
          this.push(record);
          callback();
        } catch (err) {
          callback(err);
        }
      },
    });

    // Process the data stream
    // console.log(response.data);
    response.data
      .pipe(decompressionStream)
      .pipe(csvParser({ separator: '\t' }))
      .pipe(transformStream)
      .on('data', async data => {
        try {
          // Insert data into the database
          await db.AfnInventoryDailyUpdate.create(data);
        } catch (dbErr) {
        //   console.error('Error inserting data into database:', dbErr);
        }
      })
      .on('error', error => {
        console.error('Error processing data stream:', error);
      })
      .on('end', () => {
        console.log('Data processing completed');
      });
  } catch (error) {
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

// // Example usage
// // Replace with actual URL and document ID
// const documentUrl = 'YOUR_DOCUMENT_URL';
// const compressionAlgorithm = 'GZIP'; // Set to null if no compression
// const reportDocumentId = 'YOUR_DOCUMENT_ID';

// fetchAndProcessCSV(documentUrl, compressionAlgorithm, reportDocumentId);
module.exports = {
  fetchAndProcessCSV,
};
