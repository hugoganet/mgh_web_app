const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');

/**
 * @function getPriceGridFbaFeeId
 * @description Get the FBA fee ID for a given package dimensions and weight
 * @async
 * @param {int} packageLength - The length of the package
 * @param {int} packageWidth - The width of the package
 * @param {int} packageHeight - The height of the package
 * @param {int} packageWeight - The weight of the package
 * @param {string} countryCode - The country code for which to get the FBA fee ID
 * @param {boolean} createLog - Whether to create a log for this operation
 * @param {string} logContext - The context for the log message
 * @return{Promise<int|null>} - A promise that resolves to the FBA fee ID for a given package dimensions and weight
 */
async function getPriceGridFbaFeeId(
  packageLength,
  packageWidth,
  packageHeight,
  packageWeight,
  countryCode,
  createLog = false,
  logContext = 'getPriceGridFbaFeeId',
) {
  let logMessage = '';
  try {
    // Fetch all FBA fee grid data for the given country code
    const fbaFeeData = await db.PriceGridFbaFee.findAll({
      where: { countryCode: countryCode },
    });

    if (!fbaFeeData.length) {
      logMessage += `No FBA fee data found for country code: ${countryCode}\n`;
      return null;
    }

    // Variables to hold the maximum category for each dimension
    let maxCategoryLength = null;
    let maxCategoryWidth = null;
    let maxCategoryHeight = null;

    // Iterate over FBA fee data to find max category based on dimensions
    fbaFeeData.forEach(row => {
      if (
        packageLength <= row.categoryMaxLength &&
        maxCategoryLength === null
      ) {
        maxCategoryLength = row.priceGridFbaFeeId;
      }
      if (packageWidth <= row.categoryMaxWidth && maxCategoryWidth === null) {
        maxCategoryWidth = row.priceGridFbaFeeId;
      }
      if (
        packageHeight <= row.categoryMaxHeight &&
        maxCategoryHeight === null
      ) {
        maxCategoryHeight = row.priceGridFbaFeeId;
      }
    });

    // Determine the maximum of the three categories
    const maxDimensionCategory = Math.max(
      maxCategoryLength,
      maxCategoryWidth,
      maxCategoryHeight,
    );

    // Find the FBA category based on weight, starting from the maxDimensionCategory
    const fbaCategory = fbaFeeData.find(
      row =>
        row.priceGridFbaFeeId >= maxDimensionCategory &&
        packageWeight <= row.categoryMaxWeight,
    );
    logMessage += `FBA fee ID: ${
      fbaCategory ? fbaCategory.priceGridFbaFeeId : null
    }\n`;
    return fbaCategory ? fbaCategory.priceGridFbaFeeId : null;
  } catch (error) {
    logMessage += `Error in getPriceGridFbaFeeId: ${error}\n`;
    console.error('Error in getPriceGridFbaFeeId:', error);
    return null;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = { getPriceGridFbaFeeId };
