/**
 * Preprocesses a single row from the CSV file.
 * @param {Object} chunk - The original row data from the CSV file.
 * @return {Object} The processed chunk.
 */
function preProcessCsvRow(chunk) {
  // Implement the preprocessing logic here
  // For example, sanitize the 'product-name' field or modify the chunk as needed
  // This is a placeholder implementation
  if (chunk['product-name']) {
    chunk['product-name'] = chunk['product-name'].replace(/"/g, '');
  }
  // console.log(chunk);
  return chunk;
}

module.exports = {
  preProcessCsvRow,
};
