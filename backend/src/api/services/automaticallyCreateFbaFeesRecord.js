const db = require('../models/index');
const { logAndCollect } = require('../../integrations/sp_api/logs/logger');

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
    const fbaFeesRecord = await db.FbaFee.create({
      where: {
        asinId: newlyCreatedAsinId,
        packageLength,
        packageWidth,
        packageHeight,
        packageWeight,
        priceGridFbaFeeId,
      },
    });
  } catch (error) {
    logMessage += `Error creating fbaFeesRecord: ${error}\n`;
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'automaticallyCreateFbaFeesRecord');
    }
  }
}

module.exports = {
  automaticallyCreateFbaFeesRecord,
};
