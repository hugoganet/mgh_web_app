const axios = require('axios');
const csvParser = require('csv-parser');
const { Transform } = require('stream'); // To work with streams
const marketplaces = require('../../../../config/marketplaces.js');
const {
  chooseDecompressionStream,
} = require('../../../../utils/chooseDecompressionStream.js');
const { preProcessCsvRow } = require('../../preProcessCsvRow.js');
const { processInventoryChunk } = require('./processInventoryChunk.js');
const { seedSellingPriceHistory } = require('./seedSellingPricesHistory.js');
const { logger } = require('../../../../utils/logger');
const {
  countLinesInReport,
} = require('../../../../utils/countLinesInReport.js');
const {
  startListening,
  stopListeningAndReset,
  getCounts,
} = require('../../../../utils/recordEventHandlers');

/**
 * Fetches and processes a CSV file from a given URL.
 * @async
 * @param {string} documentUrl - The URL of the CSV file.
 * @param {string|null} compressionAlgorithm - The compression algorithm used (e.g., 'GZIP'), or null if uncompressed.
 * @param {string} reportDocumentId - The document ID associated with the report.
 * @param {string[]} country - The country keys to associate with the report.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<void>} - A promise that resolves when the CSV file has been fetched and processed.
 */
async function fetchAndProcessInventoryReport(
  documentUrl,
  compressionAlgorithm,
  reportDocumentId,
  country,
  createLog,
  logContext,
) {
  const countryCode = marketplaces[country[0]].countryCode;
  const currencyCode = marketplaces[country[0]].currencyCode;
  const processingPromises = [];
  let totalLines = 0;
  let logMessage = '';

  startListening(); // Start listening for recordCreated events

  try {
    totalLines = await countLinesInReport(
      documentUrl,
      compressionAlgorithm,
      createLog,
      logContext,
    );

    const response = await axios({
      method: 'get',
      url: documentUrl,
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
            createLog,
            logContext,
          ),
        );
      })
      .on('end', async () => {
        try {
          await Promise.all(processingPromises);

          const counts = getCounts(); // Get the counts of created records
          console.log(counts.sku);

          console.log(
            `PROCESSED ${totalLines} in fetchAndProcessInventoryReport : 
          Created ${counts.sku.sku_created} new SKU records and found ${counts.sku.sku_found} SKU.
          Created ${counts.asin.asin_created} new ASIN records and found ${counts.asin.asin_found} ASIN.
          Created ${counts.eanInAsin.eanInAsin_created} new eanInAsin records and found ${counts.eanInAsin.eanInAsin_found} eanInAsin.
          Created ${counts.fbaFee.fbaFee_created} new fbaFee records and found ${counts.fbaFee.fbaFee_found} fbaFee.`,
          );

          logMessage += `PROCESSED ${totalLines} in fetchAndProcessInventoryReport : 
          Created ${counts.sku.sku_created} new SKU records and found ${counts.sku.sku_found} SKU.
          Created ${counts.asin.asin_created} new ASIN records and found ${counts.asin.asin_found} ASIN.
          Created ${counts.eanInAsin.eanInAsin_created} new eanInAsin records and found ${counts.eanInAsin.eanInAsin_found} eanInAsin.\n`;

          if (createLog) {
            logger(logMessage, logContext);
          }

          stopListeningAndReset(); // Stop listening and reset counters

          await seedSellingPriceHistory(createLog, logContext);
        } catch (error) {
          logMessage += `Error processing inventory data stream in fetchAndProcessInventoryReport: ${error}\n`;
          console.error(
            'Error processing inventory data stream in fetchAndProcessInventoryReport:',
            error,
          );
        }
      })
      .on('error', error => {
        logMessage += `Error processing inventory data stream in fetchAndProcessInventoryReport: ${error}\n`;
        console.error(
          'Error processing inventory data stream in fetchAndProcessInventoryReport:',
          error,
        );
      });
  } catch (error) {
    logMessage += `Error fetching inventory data in fetchAndProcessInventoryReport: ${error}\n`;
    console.error(
      'Error fetching inventory data in fetchAndProcessInventoryReport:',
      error,
    );
  }
}

module.exports = {
  fetchAndProcessInventoryReport,
};
