const { logAndCollect } = require('../../utils/logger');

/**
 * Extracts the package dimensions from a catalog item.
 * @function extractPackageDimensions
 * @param {Object} catalogItem - The catalog item to extract package dimensions from.
 * @param {boolean} createLog - Whether to create a log for this operation.
 * @return {Object} - An object containing the package dimensions and weight.
 */
function extractPackageDimensions(catalogItem, createLog = false) {
  const dimensions = catalogItem.attributes.item_package_dimensions?.[0];
  console.log(dimensions);
  const weightData = catalogItem.attributes.item_package_weight?.[0];
  console.log(weightData);
  let logMessage = `Starting extractPackageDimensions for catalogItem : ${JSON.stringify(
    catalogItem,
    '',
    2,
  )}\n`;

  let packageLength;
  let packageWidth;
  let packageHeight;
  let packageWeight;

  try {
    if (
      dimensions?.length?.unit !== 'centimeters' ||
      dimensions?.width?.unit !== 'centimeters' ||
      dimensions?.height?.unit !== 'centimeters'
    ) {
      throw new Error(
        `Package unit not supported. Only centimeters are supported.`,
      );
    } else {
      packageLength = dimensions?.length?.value;
      packageWidth = dimensions?.width?.value;
      packageHeight = dimensions?.height?.value;
    }

    if (weightData?.unit !== 'kilograms' && weightData?.unit !== 'grams') {
      throw new Error(`Package weight unit not supported: ${weightData?.unit}`);
    } else if (weightData?.unit === 'kilograms') {
      packageWeight = weightData?.value * 1000;
    } else {
      packageWeight = weightData?.value;
    }

    logMessage += `Package dimensions and weight resolved: ${JSON.stringify(
      {
        packageLength,
        packageWidth,
        packageHeight,
        packageWeight,
      },
      '',
      2,
    )}.\n`;
  } catch (error) {
    logMessage += `Error extracting package dimensions: ${error}\n`;
    throw new Error(`Error extracting package dimensions: ${error}`);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'extractPackageDimensions');
    }
  }
  return {
    packageLength,
    packageWidth,
    packageHeight,
    packageWeight,
  };
}

module.exports = {
  extractPackageDimensions,
};