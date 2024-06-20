/**
 * @description Parses a string to a number, validates it against a range, removes currency symbols and spaces, and optionally rounds it to a specified number of decimal places.
 * @function parseAndValidateNumber
 * @param {string} value - The value to parse and validate.
 * @param {Object} options - The options for the function including min, max, decimals, paramName, and allowNull.
 * @param {number} options.min - The minimum value for the number. Defaults to -Infinity.
 * @param {number} options.max - The maximum value for the number. Defaults to Infinity.
 * @param {string} options.paramName - The name of the parameter for the error message. Defaults to an empty string.
 * @param {number} options.decimals - The number of decimal places to round the number to. Defaults to null (no rounding).
 * @param {boolean} options.allowNull - Allows null values without throwing an error. Defaults to false.
 * @param {boolean} options.applyRounding - Whether to apply rounding after the calculation. Defaults to false.
 * @return {number|null} The parsed, validated, and optionally rounded number, or null if allowNull is true and value is empty.
 */
function parseAndValidateNumber(
  value,
  {
    min = -Infinity,
    max = Infinity,
    paramName = '',
    decimals = null,
    allowNull = false,
    applyRounding = false,
  } = {},
) {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    if (allowNull) {
      return null;
    } else {
      throw new Error(
        `Invalid value for ${paramName}: ${value}. Value cannot be null or undefined.`,
      );
    }
  }

  // Ensure value is a string
  value = String(value);

  // Remove currency symbols and spaces from the string
  let cleanedValue = value.replace(/[€$£ ]/g, '');

  // Detect and convert percentage values whether the % sign is before or after the number
  const isPercentage =
    cleanedValue.endsWith('%') || cleanedValue.startsWith('%');
  if (isPercentage) {
    cleanedValue = cleanedValue.replace(/%/, ''); // Remove the percentage sign
    let number = parseFloat(cleanedValue) / 100; // Convert to a decimal

    if (isNaN(number) || number < min || number > max) {
      throw new Error(
        `Invalid value for ${paramName}: ${value}. Must be a number between ${min} and ${max}.`,
      );
    }

    if (decimals !== null && Number.isInteger(decimals) && decimals >= 0) {
      const factor = Math.pow(10, decimals);
      number = Math.round(number * factor) / factor;
    }

    return number;
  } else {
    let number = parseFloat(cleanedValue);

    if (isNaN(number) || number < min || number > max) {
      throw new Error(
        `Invalid value for ${paramName}: ${value}. Must be a number between ${min} and ${max}.`,
      );
    }

    if (
      applyRounding &&
      decimals !== null &&
      Number.isInteger(decimals) &&
      decimals >= 0
    ) {
      const factor = Math.pow(10, decimals);
      number = Math.round(number * factor) / factor;
    }

    return number;
  }
}

module.exports = { parseAndValidateNumber };
