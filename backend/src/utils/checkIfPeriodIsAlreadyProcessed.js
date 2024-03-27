const db = require('../api/models/index');

/**
 * @description Check if the period has already been processed.
 * @function checkIfPeriodIsAlreadyProcessed
 * @param {string} dataStartTime - The start date and time for the report data in ISO 8601 format.
 * @param {string} dataEndTime - The end date and time for the report data in ISO 8601 format.
 */
async function checkIfPeriodIsAlreadyProcessed(dataStartTime, dataEndTime) {
  const overlapCount = await db.AfnRemovalShipmentsDetails.count({
    where: {
      [Sequelize.Op.or]: [
        {
          dataStartTime: {
            [Sequelize.Op.between]: [dataStartTime, dataEndTime],
          },
        },
        {
          dataEndTime: {
            [Sequelize.Op.between]: [dataStartTime, dataEndTime],
          },
        },
      ],
    },
  });

  return overlapCount > 0; // If there's any overlap, returns true; otherwise, false
}

module.exports = {
  checkIfPeriodIsAlreadyProcessed,
};
