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
                  lineCount++;
                }
              });
              callback();
            },
          }),
        )
        .on('end', () => {
          logMessage += `Processed ${lineCount} lines.\n`;
          if (createLog) {
            logger(logMessage, logContext);
          }
          resolve(lineCount);
        })
        .on('error', error => {
          reject(error);
        });
    });
  } catch (error) {
    logMessage += `Error in countLinesInReport: ${error}\n`;
    if (createLog) {
      logger(logMessage, logContext);
    }
    throw error;
  }
}

module.exports = { countLinesInReport };

// countLinesInReport(
//   'https://tortuga-prod-eu.s3-eu-west-1.amazonaws.com/98cc842b-90af-49fa-86c3-5fc514b0504e.amzn1.tortuga.4.eu.TJ2SWZX5RLJ6C?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240207T112854Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=AKIAX2ZVOZFBLRVE6O7G%2F20240207%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Signature=f9de506085206c69f2a388e9c313c4c3468d1a4651d14300d6184969e79b8305',
//   undefined,
//   true,
// );
