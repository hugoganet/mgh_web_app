const axios = require('axios');
const csvParser = require('csv-parser');
const { Transform } = require('stream');
const {
  chooseDecompressionStream,
} = require('../../chooseDecompressionStream.js');
const { preProcessCsvRow } = require('../../preProcessCsvRow.js');
const { processSalesChunk } = require('./processSaleChunk.js'); // New module for processing chunks
const { logAndCollect } = require('../../logs/logger.js');

/**
 * Fetches and processes a CSV file from a given URL.
 *
 * @async
 * @param {string} url - The URL of the CSV file.
 * @param {string|null} compressionAlgorithm - The compression algorithm used (e.g., 'GZIP'), or null if uncompressed.
 * @param {string} reportDocumentId - The document ID associated with the report.
 * @param {string} reportType - The type of report being processed.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<void>} - A promise that resolves when the CSV file has been fetched and processed.
 */
async function fetchAndProcessSalesReport(
  url,
  compressionAlgorithm,
  reportDocumentId,
  reportType,
  createLog = false,
) {
  const processingPromises = [];
  let logMessage = `Starting fetchAndProcessSalesReport for ReportDocumentId: ${reportDocumentId}\n`;
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    });

    const decompressionStream = chooseDecompressionStream(compressionAlgorithm);

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
          processSalesChunk(chunk, reportDocumentId, reportType, createLog),
        );
      })
      .on('end', async () => {
        try {
          await Promise.all(processingPromises);
          console.log('Sales data processing completed');
          logMessage += 'Sales data processing completed successfully.\n';
        } catch (error) {
          logMessage += `Error processing sales data stream: ${error}\n`;
          console.error('Error processing sales data stream:', error);
        }
      })
      .on('error', error => {
        logMessage += `Error processing sales data stream: ${error}\n`;
        console.error('Error processing sales data stream:', error);
      });
  } catch (error) {
    logMessage += `Error fetching sales data: ${error}\n`;
    console.error('Error fetching sales data:', error);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'FetchAndProcessSalesReport');
    }
  }
}

module.exports = { fetchAndProcessSalesReport };
