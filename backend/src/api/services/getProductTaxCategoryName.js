const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');

/**
 * @function getProductTaxCategoryName
 * @param {number} productTaxCategoryId
 * @param {boolean} createLog - Whether to create a log for this operation.
 * @param {string} logContext - The context for the log message.
 * @return {Promise<string>} productTaxCategoryName
 */
async function getProductTaxCategoryName(
  productTaxCategoryId,
  createLog = false,
  logContext = 'getProductTaxCategoryName',
) {
  try {
    const productTaxCategoryName = await db.ProductTaxCategory.findOne({
      where: {
        productTaxCategoryId: productTaxCategoryId,
      },
    });

    return productTaxCategoryName
      ? productTaxCategoryName.productTaxCategoryName
      : null;
  } catch (error) {
    if (createLog) {
      logger(
        `Error for productTaxCategoryId: ${productTaxCategoryId} in getProductTaxCategoryName: ${error}\n`,
        logContext,
      );
    }
    console.error(`Error in getProductTaxCategoryName`);
    throw new Error(`Error in getProductTaxCategoryName: ${error.message}`);
  }
}

module.exports = {
  getProductTaxCategoryName,
};
