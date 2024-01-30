const db = require('../models/index');
const { logAndCollect } = require('../../integrations/sp_api/logs/logger');

/**
 * Retrieves the product category rank ID based on category ID, country code, and sales rank.
 * @param {number} productCategoryId - The product category ID.
 * @param {string} countryCode - The country code.
 * @param {number} salesRank - The sales rank.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<number|null>} The product category rank ID, or null if not found.
 */
async function getProductCategoryRankId(
  productCategoryId,
  countryCode,
  salesRank,
  createLog = false,
) {
  let logMessage = 'Starting getProductCategoryRankId\n';
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

    logMessage += `Found productCategoryRankId : ${record.productCategoryRankId}\n`;
    return record ? record.productCategoryRankId : null;
  } catch (error) {
    console.error(`Error in getProductCategoryRankId: ${error}`);
    logMessage += `Error in getProductCategoryRankId: ${error}\n`;
    return null;
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'getProductCategoryRankId');
    }
  }
}

module.exports = { getProductCategoryRankId };
