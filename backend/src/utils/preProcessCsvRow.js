const { logger } = require('./logger');

/**
 * Preprocesses a single row from the CSV file.
 * @param {Object} chunk - The original row data from the CSV file.
 * @param {string} logContext - The context for the log message.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Object} The processed chunk.
 */
function preProcessCsvRow(chunk, logContext, createLog) {
  if (chunk['product-name']) {
    chunk['product-name'] = chunk['product-name'].replace(/"/g, '');
    if (createLog) {
      logger(`Processed product-name: ${chunk['product-name']}\n`, logContext);
    }
  }
  return chunk;
}

module.exports = {
  preProcessCsvRow,
};
