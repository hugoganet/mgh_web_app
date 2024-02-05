const db = require('../models/index');
const { logger } = require('../../utils/logger');

/**
 * @description This function creates an EAN in ASIN record in the database if it does not exist.
 * @function automaticallyCreateEanInAsinRecord
 * @param {number} similarAsinId - ASIN to create a record for
 * @param {number} newlyCreatedAsinId - Marketplace ID to create a record for
 * @param {boolean} createLog - Whether to create a log for this operation
 * @return {Promise<void>}
 */
async function automaticallyCreateEanInAsinRecord(
  similarAsinId,
  newlyCreatedAsinId,
  createLog = false,
) {
  let logMessage = `Starting automaticallyCreateEanInAsinRecord for newly created asinId : ${newlyCreatedAsinId}.\n`;
  try {
    const eanInAsinRecords = await db.EanInAsin.findAll({
      where: {
        asinId: similarAsinId,
      },
    });

    if (eanInAsinRecords.length > 0) {
      for (eanInAsinRecord of eanInAsinRecords) {
        logMessage += `similarAsinId : ${similarAsinId} is compososed with : ${eanInAsinRecord.eanInAsinQuantity} of ${eanInAsinRecord.ean}\n`;
        const newlyCreatedEanInAsinRecord = await db.EanInAsin.create({
          ean: eanInAsinRecord.ean,
          asinId: newlyCreatedAsinId,
          eanInAsinQuantity: eanInAsinRecord.eanInAsinQuantity,
        });
        logMessage += `Created new eanInAsinRecord with id : ${newlyCreatedEanInAsinRecord.eanInAsinId}\n`;
      }
    }
  } catch (error) {
    logMessage += `Error fetching asin record: ${error}\n`;
  } finally {
    if (createLog) {
      logger(logMessage, 'automaticallyCreateEanInAsinRecord');
    }
  }
}

module.exports = {
  automaticallyCreateEanInAsinRecord,
};
