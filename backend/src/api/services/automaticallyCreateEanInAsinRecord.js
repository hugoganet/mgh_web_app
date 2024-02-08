const db = require('../models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../../src/utils/eventBus');

/**
 * @description This function creates an EAN in ASIN record in the database if it does not exist.
 * @function automaticallyCreateEanInAsinRecord
 * @param {number} similarAsinId - ASIN to create a record for
 * @param {number} newlyCreatedAsinId - Marketplace ID to create a record for
 * @param {boolean} createLog - Whether to create a log for this operation
 * @param {string} logContext - The context for the log message
 * @return {Promise<void>}
 */
async function automaticallyCreateEanInAsinRecord(
  similarAsinId,
  newlyCreatedAsinId,
  createLog = false,
  logContext = 'automaticallyCreateEanInAsinRecord',
) {
  let logMessage = '';
  try {
    const eanInAsinRecords = await db.EanInAsin.findAll({
      where: {
        asinId: similarAsinId,
      },
    });

    if (eanInAsinRecords.length > 0) {
      for (const record of eanInAsinRecords) {
        const newlyCreatedEanInAsinRecord = await db.EanInAsin.create({
          ean: record.ean,
          asinId: newlyCreatedAsinId,
          eanInAsinQuantity: record.eanInAsinQuantity,
        });
        if (newlyCreatedEanInAsinRecord.eanInAsinId) {
          eventBus.emit('recordCreated', {
            type: 'eanInAsin',
            action: 'eanInAsin_created',
            id: newlyCreatedEanInAsinRecord.eanInAsinId,
          });
        }
        logMessage += `Created new eanInAsinRecord with id : ${newlyCreatedEanInAsinRecord.eanInAsinId} for asinId:${newlyCreatedAsinId}\n`;
      }
    } else {
      throw new Error(
        `No eanInAsinRecords found for similarAsinId: ${similarAsinId}`,
      );
    }
  } catch (error) {
    console.error(
      `Error creating eanInAsinRecord for asinId:${newlyCreatedAsinId}`,
    );
    logMessage += `Error creating eanInAsinRecord for asinId:${newlyCreatedAsinId} : ${error}\n`;
    throw new Error(`Error fetching asin record: ${error}`);
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  automaticallyCreateEanInAsinRecord,
};
