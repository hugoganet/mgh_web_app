/**
 * @description Parses a string to a number and validates it against a range.
 * @function parseAndValidateNumber
 * @param {string} value - The value to parse and validate.
 * @param {Object} options - The options for the function.
 * @param {number} options.min - The minimum value for the number. Defaults to -Infinity.
 * @param {number} options.max - The maximum value for the number. Defaults to Infinity.
 * @param {string} options.paramName - The name of the parameter for the error message. Defaults to an empty string.
 * @return {number} The parsed and validated number.
 */
function parseAndValidateNumber(
  value,
  { min = -Infinity, max = Infinity, paramName = '' } = {},
) {
  const number = parseFloat(value);
  if (isNaN(number) || number < min || number > max) {
    throw new Error(
      `Invalid value for ${paramName}: ${value}. Must be a number between ${min} and ${max}.`,
    );
  }
  return number;
}

module.exports = { parseAndValidateNumber };
