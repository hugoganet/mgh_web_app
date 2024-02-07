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
  let lineCount = 0;

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

// countLinesInReport(
//   'https://tortuga-prod-eu.s3-eu-west-1.amazonaws.com/6ca6d8f3-8f36-4079-9b1b-0e60d114aec4.amzn1.tortuga.4.eu.T2FE9GSBFIFIHT?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240207T140905Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=AKIAX2ZVOZFBLRVE6O7G%2F20240207%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Signature=2fdab927b804f3718f719333daac90e227730485ad1a230991cf8a7d849b1125',
//   undefined,
//   true,
// );
