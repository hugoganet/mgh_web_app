const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');

/**
 * Retrieves the product category rank ID based on category ID, country code, and sales rank.
 * @param {number} productCategoryId - The product category ID.
 * @param {string} countryCode - The country code.
 * @param {number} salesRank - The sales rank.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<number|null>} The product category rank ID, or null if not found.
 */
async function getProductCategoryRankId(
  productCategoryId,
  countryCode,
  salesRank,
  createLog = false,
  logContext = 'getProductCategoryRankId',
) {
  try {
    // Find the record where salesRank is less than or equal to rankingThreshold
    const record = await db.ProductCategoryRank.findOne({
      where: {
        productCategoryId: productCategoryId,
        countryCode: countryCode,
        rankingThreshold: {
          [db.Sequelize.Op.gte]: salesRank, // Greater than or equal to salesRank
        },
      },
      order: [
        ['rankingThreshold', 'ASC'], // Order by rankingThreshold ascending
      ],
    });

    return record ? record.productCategoryRankId : null;
  } catch (error) {
    if (createLog) {
      logger(`Error in getProductCategoryRankId: ${error}\n`, logContext);
    }
    console.error(`Error in getProductCategoryRankId`);
    throw new Error(`Error in getProductCategoryRankId: ${error.message}`);
  }
}

module.exports = { getProductCategoryRankId };
