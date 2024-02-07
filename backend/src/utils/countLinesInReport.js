const { Transform } = require('stream');
const axios = require('axios');
const {
  chooseDecompressionStream,
} = require('../utils/chooseDecompressionStream');
const { logger } = require('../utils/logger');

/**
 * Counts the number of lines in a report document.
 * @async
 * @param {string} documentUrl - The URL of the report document.
 * @param {string|null} compressionAlgorithm - The compression algorithm used (e.g., 'GZIP'), or null if uncompressed.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<number>} - A promise that resolves to the number of lines in the report.
 */
async function countLinesInReport(
  documentUrl,
  compressionAlgorithm,
  createLog = false,
  logContext = 'countLinesInReport',
) {
  let logMessage = `Starting countLinesInReport for ${documentUrl}.\n`;
  let lineCount = -1; // Start at -1 to account for the header line

  try {
    const response = await axios({
      method: 'get',
      url: documentUrl,
      responseType: 'stream',
    });

    const decompressionStream = chooseDecompressionStream(compressionAlgorithm);

    return new Promise((resolve, reject) => {
      response.data
        .pipe(decompressionStream)
        .pipe(
          new Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
              const lines = chunk.toString().split('\n');
              lines.forEach(line => {
                if (!line.startsWith('#') && line.trim() !== '') {
                  lineCount++;
                }
              });
              callback();
            },
          }),
        )
        .on('finish', () => {
          logMessage += `Processed ${lineCount} lines.\n`;
          if (createLog) {
            logger(logMessage, logContext);
          }
          resolve(lineCount);
        })
        .on('error', error => {
          console.error(`Error counting lines`);
          logMessage += `Error counting lines: ${error}\n`;
          if (createLog) {
            logger(logMessage, logContext);
          }
          response.data.destroy(); // Close the stream
          reject(error);
        });
    });
  } catch (error) {
    console.error(`Error in countLinesInReport`);
    logMessage += `Error in countLinesInReport: ${error}\n`;
    throw error;
  }
}

module.exports = { countLinesInReport };
