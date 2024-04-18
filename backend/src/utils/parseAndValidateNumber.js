/**
 * @description Parses a string to a number, validates it against a range, removes currency symbols and spaces, and optionally rounds it to a specified number of decimal places.
 * @function parseAndValidateNumber
 * @param {string} value - The value to parse and validate.
 * @param {Object} options - The options for the function.
 * @param {number} options.min - The minimum value for the number. Defaults to -Infinity.
 * @param {number} options.max - The maximum value for the number. Defaults to Infinity.
 * @param {string} options.paramName - The name of the parameter for the error message. Defaults to an empty string.
 * @param {number} options.decimals - The number of decimal places to round the number to. Defaults to null (no rounding).
 * @return {number} The parsed, validated, and optionally rounded number.
 */
function parseAndValidateNumber(
  value,
  { min = -Infinity, max = Infinity, paramName = '', decimals = null } = {},
) {
  // Remove currency symbols and spaces from the string
  let cleanedValue = value.replace(/[€$£ ]/g, '');

  // Detect and convert percentage values whether the % sign is before or after the number
  const isPercentage =
    cleanedValue.endsWith('%') || cleanedValue.startsWith('%');
  if (isPercentage) {
    // Remove the percentage sign from either side
    cleanedValue = cleanedValue.replace(/%/, '');
    // Convert to a decimal by dividing by 100
    let number = parseFloat(cleanedValue) / 100;

    if (isNaN(number) || number < min || number > max) {
      throw new Error(
        `Invalid value for ${paramName}: ${value}. Must be a number between ${min} and ${max}.`,
      );
    }

    // If decimals is specified, round the number to the specified number of decimal places
    if (decimals !== null && Number.isInteger(decimals) && decimals >= 0) {
      const factor = Math.pow(10, decimals);
      number = Math.round(number * factor) / factor;
    }

    return number;
  } else {
    // Handle non-percentage numbers as usual
    let number = parseFloat(cleanedValue);

    if (isNaN(number) || number < min || number > max) {
      throw new Error(
        `Invalid value for ${paramName}: ${value}. Must be a number between ${min} and ${max}.`,
      );
    }

    // If decimals is specified and is a non-negative integer, round the number to the specified number of decimal places
    if (decimals !== null && Number.isInteger(decimals) && decimals >= 0) {
      const factor = Math.pow(10, decimals);
      number = Math.round(number * factor) / factor;
    }

    return number;
  }
}

module.exports = { parseAndValidateNumber };
