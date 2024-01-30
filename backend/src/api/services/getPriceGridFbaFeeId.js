const db = require('../models');
const { logAndCollect } = require('../../integrations/sp_api/logs/logger');

/**
 * @function getPriceGridFbaFeeId
 * @description Get the FBA fee ID for a given package dimensions and weight
 * @async
 * @param {int} packageLength
 * @param {int} packageWidth
 * @param {int} packageHeight
 * @param {int} packageWeight
 * @param {string} countryCode
 * @param {boolean} createLog
 * @return{Promise<int|null>} - A promise that resolves to the FBA fee ID for a given package dimensions and weight
 */
async function getPriceGridFbaFeeId(
  packageLength,
  packageWidth,
  packageHeight,
  packageWeight,
  countryCode,
  createLog = false,
) {
  let logMessage = `Getting FBA fee ID for package dimensions: ${packageLength}x${packageWidth}x${packageHeight} and weight: ${packageWeight} for country code: ${countryCode}\n`;
  try {
    // Fetch all FBA fee grid data for the given country code
    const fbaFeeData = await db.PriceGridFbaFee.findAll({
      where: { countryCode: countryCode },
    });

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
      logAndCollect(logMessage, 'GetPriceGridFbaFeeId');
    }
  }
}

module.exports = { getPriceGridFbaFeeId };
