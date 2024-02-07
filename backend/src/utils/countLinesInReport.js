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
  try {
    const response = await axios({
      method: 'get',
      url: documentUrl,
      responseType: 'stream',
    });
    const decompressionStream = chooseDecompressionStream(compressionAlgorithm);
    let lineCount = 0;

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
                  // Skip comment lines and empty lines
                  lineCount++;
                }
              });
              callback();
            },
          }),
        )
        .on(
          'end',
          () => resolve(lineCount),
          (logMessage += `Processed ${lineCount} lines.\n`),
        )
        .on('error', reject);
    });
  } catch (error) {
    console.log('Error in countLinesInReport:');
    logMessage += `Error in countLinesInReport: ${error}\n`;
    throw error;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { countLinesInReport };
