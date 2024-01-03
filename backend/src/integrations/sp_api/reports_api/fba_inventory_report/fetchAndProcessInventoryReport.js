const axios = require('axios');
const csvParser = require('csv-parser');
const { Transform } = require('stream'); // To work with streams
const marketplaces = require('../../../../config/marketplaces.js'); // Marketplace configuration
const {
  chooseDecompressionStream,
} = require('../../chooseDecompressionStream.js');
const { preProcessCsvRow } = require('./preProcessCsvRow.js');
const { processInventoryChunk } = require('./processInventoryChunk.js');
const { seedSellingPriceHistory } = require('./seedSellingPricesHistory.js');

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
  const processingPromises = [];

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

    response.data
      .pipe(decompressionStream)
      .pipe(csvParser({ separator: '\t', escape: '"', quote: '' }))
      .pipe(transformStream)
      .on('data', chunk => {
        processingPromises.push(
          processInventoryChunk(
            chunk,
            reportDocumentId,
            countryCode,
            currencyCode,
            reportType,
          ),
        );
      })
      .on('end', async () => {
        try {
          await Promise.all(processingPromises);
          console.log('Data processing completed');
          await seedSellingPriceHistory();
        } catch (error) {
          console.error('Error processing data stream:', error);
        }
      })
      .on('error', error => {
        console.error('Error processing data stream:', error);
      });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

module.exports = {
  fetchAndProcessInventoryReport,
};
