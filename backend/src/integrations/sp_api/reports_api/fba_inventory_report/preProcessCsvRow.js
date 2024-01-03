/**
 * Preprocesses a single row from the CSV file.
 * @param {Object} chunk - The original row data from the CSV file.
 * @return {Object} The processed chunk.
 */
function preProcessCsvRow(chunk) {
  if (chunk['product-name']) {
    chunk['product-name'] = chunk['product-name'].replace(/"/g, '');
  }

  return chunk;
}

module.exports = {
  preProcessCsvRow,
};
