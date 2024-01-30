const db = require('../models/index');
const { logAndCollect } = require('../../integrations/sp_api/logs/logger');
const { getPriceGridFbaFeeId } = require('./getPriceGridFbaFeeId');

/**
 * @description This function creates an EAN in ASIN record in the database if it does not exist.
 * @function automaticallyCreateFbaFeesRecord
 * @param {number} packageLength - length of the package of the newly created asin
 * @param {number} packageWidth - width of the package of the newly created asin
 * @param {number} packageHeight - height of the package of the newly created asin
 * @param {number} packageWeight - weight of the package of the newly created asin
 * @param {number} newlyCreatedAsinId - asinId of the newly created asin
 * @param {string} countryCode - country code of the newly created asin
 * @param {boolean} createLog - Whether to create a log for this operation
 * @return {Promise<void>}
 */
async function automaticallyCreateFbaFeesRecord(
  packageLength,
  packageWidth,
  packageHeight,
  packageWeight,
  newlyCreatedAsinId,
  countryCode,
  createLog = false,
) {
  let logMessage = `Starting automaticallyCreateFbaFeesRecord for newly created asinId : ${newlyCreatedAsinId}.\n`;
  try {
    const priceGridFbaFeeId = await getPriceGridFbaFeeId(
      packageLength,
      packageWidth,
      packageHeight,
      packageWeight,
      countryCode,
    );
    if (priceGridFbaFeeId !== null) {
      logMessage += `Successfully got priceGridFbaFeeId: ${priceGridFbaFeeId}\n`;

      const fbaFeesRecord = await db.FbaFee.create({
        asinId: newlyCreatedAsinId,
        packageLength,
        packageWidth,
        packageHeight,
        packageWeight,
        priceGridFbaFeeId,
      });
      logMessage += `Successfully created fbaFeesRecord: ${JSON.stringify(
        fbaFeesRecord,
      )}\n`;
    } else {
      logMessage += `Could not get priceGridFbaFeeId for newly created asinId: ${newlyCreatedAsinId}\n`;
    }
  } catch (error) {
    logMessage += `Error in automaticallyCreateFbaFeesRecord: ${error.message}\n`;
    throw new Error(
      `Error in automaticallyCreateFbaFeesRecord: ${error.message}`,
    );
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'automaticallyCreateFbaFeesRecord');
    }
  }
}

module.exports = {
  automaticallyCreateFbaFeesRecord,
};
