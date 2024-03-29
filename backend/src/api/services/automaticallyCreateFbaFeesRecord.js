const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const { getPriceGridFbaFeeId } = require('./getPriceGridFbaFeeId');
const eventBus = require('../../../src/utils/eventBus');

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
 * @param {string} logContext - The context for the log message
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
  logContext = 'automaticallyCreateFbaFeesRecord',
) {
  let logMessage = '';
  try {
    const priceGridFbaFeeId = await getPriceGridFbaFeeId(
      packageLength,
      packageWidth,
      packageHeight,
      packageWeight,
      countryCode,
      createLog,
      logContext,
    );
    if (priceGridFbaFeeId !== null) {
      const fbaFeesRecord = await db.FbaFee.create({
        asinId: newlyCreatedAsinId,
        packageLength,
        packageWidth,
        packageHeight,
        packageWeight,
        priceGridFbaFeeId,
      });
      if (fbaFeesRecord.fbaFeeId) {
        eventBus.emit('recordCreated', {
          type: 'fbaFee',
          action: 'fbaFee_created',
          id: fbaFeesRecord.fbaFeeId,
        });
      }
      logMessage += `Successfully created fbaFeesRecord for asinId: ${newlyCreatedAsinId} with id: ${fbaFeesRecord.fbaFeeId}\n`;
    } else {
      logMessage += `Could not get priceGridFbaFeeId for asinId: ${newlyCreatedAsinId}\n`;
    }
  } catch (error) {
    console.log(
      `Error creating fbaFeesRecord for asinId:${newlyCreatedAsinId}`,
    );
    logMessage += `Error in automaticallyCreateFbaFeesRecord: ${error.message}\n`;
    throw new Error(
      `Error in automaticallyCreateFbaFeesRecord: ${error.message}`,
    );
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  automaticallyCreateFbaFeesRecord,
};
