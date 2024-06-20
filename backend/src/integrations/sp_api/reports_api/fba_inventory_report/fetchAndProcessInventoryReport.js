const axios = require('axios');
const csvParser = require('csv-parser');
const { Transform } = require('stream'); // To work with streams
const marketplaces = require('../../../../utils/marketplaces.js');
const {
  chooseDecompressionStream,
} = require('../../../../utils/chooseDecompressionStream.js');
const { preProcessCsvRow } = require('../../../../utils/preProcessCsvRow.js');
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
  createLog = false,
  logContext = 'fetchAndProcessInventoryReport',
) {
  if (country === 'united kingdom') {
    country = 'unitedKingdom';
  }

  const countryCode = marketplaces[country].countryCode;
  const currencyCode = marketplaces[country].currencyCode;
  const processingPromises = [];
  let totalLines = 0;
  let logMessage = '';

  startListening(); // Start listening for recordCreated events

  try {
    totalLines = await countLinesInReport(
      documentUrl,
      compressionAlgorithm,
      (createLog = true),
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

          console.log(
            `PROCESSED ${totalLines} in fetchAndProcessInventoryReport : 
          Created ${counts.sku.sku_created} new SKU records and found ${counts.sku.sku_found} SKU.
          Created ${counts.asin.asin_created} new ASIN records and found ${counts.asin.asin_found} ASIN.
          Created ${counts.eanInAsin.eanInAsin_created} new eanInAsin records and found ${counts.eanInAsin.eanInAsin_found} eanInAsin.
          Created ${counts.fbaFee.fbaFee_created} new fbaFee records and found ${counts.fbaFee.fbaFee_found} fbaFee.
          Created ${counts.asinSku.asinSku_created} new asinSku records and found ${counts.asinSku.asinSku_found} asinSku.
          Created ${counts.minimumSellingPrice.minimumSellingPrice_created} new minimumSellingPrice records and found ${counts.minimumSellingPrice.minimumSellingPrice_found} minimumSellingPrice.
          Created ${counts.afnInventoryDailyUpdate.afnInventoryDailyUpdate_created} new afnInventoryDailyUpdate records and update ${counts.afnInventoryDailyUpdate.afnInventoryDailyUpdate_updated}.
          Created ${counts.sellingPriceHistory.sellingPriceHistory_created} new sellingPriceHistory records and found ${counts.sellingPriceHistory.sellingPriceHistory_found}.`,
          );

          logMessage += `PROCESSED ${totalLines} in fetchAndProcessInventoryReport : 
          Created ${counts.sku.sku_created} new SKU records and found ${counts.sku.sku_found} SKU.
          Created ${counts.asin.asin_created} new ASIN records and found ${counts.asin.asin_found} ASIN.
          Created ${counts.eanInAsin.eanInAsin_created} new eanInAsin records and found ${counts.eanInAsin.eanInAsin_found} eanInAsin.
          Created ${counts.fbaFee.fbaFee_created} new fbaFee records and found ${counts.fbaFee.fbaFee_found} fbaFee.
          Created ${counts.asinSku.asinSku_created} new asinSku records and found ${counts.asinSku.asinSku_found} asinSku.
          Created ${counts.minimumSellingPrice.minimumSellingPrice_created} new minimumSellingPrice records and found ${counts.minimumSellingPrice.minimumSellingPrice_found} minimumSellingPrice.
          Created ${counts.afnInventoryDailyUpdate.afnInventoryDailyUpdate_created} new afnInventoryDailyUpdate records and update ${counts.afnInventoryDailyUpdate.afnInventoryDailyUpdate_updated}.
          Created ${counts.sellingPriceHistory.sellingPriceHistory_created} new sellingPriceHistory records and found ${counts.sellingPriceHistory.sellingPriceHistory_found}.\n`;

          if (createLog) {
            logger(logMessage, logContext);
          }
          // Seed SellingPriceHistory table with recent data
          await seedSellingPriceHistory(createLog, logContext);
          stopListeningAndReset();
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
