const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');
const eventBus = require('../../utils/eventBus');
const {
  automaticallyCreateAsinRecord,
} = require('./automaticallyCreateAsinRecord.js');

/**
 * @description This function finds or creates an ASIN record in the database if it does not exist.
 * @async
 * @function findOrCreateAsinRecord
 * @param {string} asin - The ASIN for which to create a record.
 * @param {string} countryCode - The country code for which to create a record.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 */
async function findOrCreateAsinRecord(
  asin,
  countryCode,
  createLog,
  logContext,
) {
  let logMessage = '';
  try {
    let associatedAsinRecord = await db.Asin.findOne({
      where: {
        asin,
        countryCode,
      },
    });
    if (associatedAsinRecord) {
      eventBus.emit('recordCreated', {
        type: 'asin',
        action: 'asin_found',
        id: associatedAsinRecord.asinId,
      });
      logMessage += `Associated ASIN found in processInventoryChunk for ${asin} in ${countryCode}, creating AsinSku record\n`;
    } else if (!associatedAsinRecord) {
      logMessage += `No associated ASIN found in processInventoryChunk for ASIN: ${asin} in ${countryCode}\n`;
      associatedAsinRecord = await automaticallyCreateAsinRecord(
        asin,
        (marketplaceId = null),
        countryCode,
        createLog,
        logContext,
      );
      logMessage += `Created new ASIN record for ASIN: ${asin} in ${countryCode}\n`;
    }
    return associatedAsinRecord;
  } catch (error) {
    logMessage += `Error creating ASIN record for ASIN: ${asin} in ${countryCode}\n`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  findOrCreateAsinRecord,
};
