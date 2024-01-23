const axios = require('axios');
const csvParser = require('csv-parser');
const { Transform } = require('stream'); // To work with streams
const marketplaces = require('../../../../config/marketplaces.js');
const {
  chooseDecompressionStream,
} = require('../../chooseDecompressionStream.js');
const { preProcessCsvRow } = require('../../preProcessCsvRow.js');
const { processInventoryChunk } = require('./processInventoryChunk.js');
const { seedSellingPriceHistory } = require('./seedSellingPricesHistory.js');
const { logAndCollect } = require('../../logs/logger.js');

/**
 * Fetches and processes a CSV file from a given URL.
 * @async
 * @param {string} url - The URL of the CSV file.
 * @param {string|null} compressionAlgorithm - The compression algorithm used (e.g., 'GZIP'), or null if uncompressed.
 * @param {string} reportDocumentId - The document ID associated with the report.
 * @param {string[]} countryKeys - The country keys to associate with the report.
 * @param {string} reportType - The type of report being processed.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<void>} - A promise that resolves when the CSV file has been fetched and processed.
 */
async function fetchAndProcessInventoryReport(
  url,
  compressionAlgorithm,
  reportDocumentId,
  countryKeys,
  reportType,
  createLog = false,
) {
  const countryCode = marketplaces[countryKeys[0]].countryCode;
  const currencyCode = marketplaces[countryKeys[0]].currencyCode;
  const processingPromises = [];
  let logMessage = `Starting fetchAndProcessInventoryReport for ReportDocumentId: ${reportDocumentId}\n`;

  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    });

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
          logMessage += `Error in transform stream: ${err}\n`;
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
            createLog,
          ),
        );
      })
      .on('end', async () => {
        try {
          await Promise.all(processingPromises);
          console.log('Inventory data processing completed');
          logMessage += 'Inventory data processing completed successfully.\n';
          await seedSellingPriceHistory(createLog);
        } catch (error) {
          logMessage += `Error processing inventory data stream: ${error}\n`;
          console.error('Error processing inventory data stream:', error);
        }
      })
      .on('error', error => {
        logMessage += `Error processing inventory data stream: ${error}\n`;
        console.error('Error processing inventory data stream:', error);
      });
  } catch (error) {
    logMessage += `Error fetching inventory data: ${error}\n`;
    console.error('Error fetching inventory data:', error);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'FetchAndProcessInventoryReport');
    }
  }
}

module.exports = {
  fetchAndProcessInventoryReport,
};
