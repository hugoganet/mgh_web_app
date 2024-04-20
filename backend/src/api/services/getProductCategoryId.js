const db = require('../../database/models/index');
const { logger } = require('../../utils/logger');

/**
 * @description This function is used to retrieve the product category ID based on the product category name and country code.
 * @function getProductCategoryId
 * @param {string} productCategory - The name of the product category as it appears in the country-specific field.
 * @param {string} countryCode - The ISO country code (e.g., 'FR', 'DE', 'IT', 'ES', 'GB').
 * @param {boolean} [createLog=false] - A flag to indicate whether a log should be created.
 * @param {string} [logContext='getProcuctCategoryId'] - The context for the log message.
 * @param {boolean} [flushBuffer=false] - A flag to indicate whether the log buffer should be flushed.
 * @return {Promise<number|null>} The product category ID if found, otherwise null.
 */
async function getProductCategoryId(
  productCategory,
  countryCode,
  createLog = false,
  logContext = 'getProcuctCategoryId',
  flushBuffer = false,
) {
  // Mapping of country codes to the corresponding product category field names in the database
  const categoryFieldMapping = {
    FR: 'productCategoryNameFr',
    DE: 'productCategoryNameDe',
    IT: 'productCategoryNameIt',
    ES: 'productCategoryNameEs',
    GB: 'productCategoryNameEn',
  };
  // Convert countryCode to uppercase to handle case insensitivity
  const normalizedCountryCode = countryCode.toUpperCase();

  // Get the appropriate field name for the product category based on the country code
  const categoryFieldName = categoryFieldMapping[normalizedCountryCode];

  // Guard clause for unsupported country codes
  if (!categoryFieldName) {
    console.error(`Unsupported country code: ${normalizedCountryCode}`);
    return null;
  }

  // Query the ProductCategory model using a dynamic field name
  const productCategoryData = await db.ProductCategory.findOne({
    where: {
      [categoryFieldName]: productCategory,
    },
  });

  if (!productCategoryData && createLog) {
    logger(
      `${categoryFieldName} Product category ID for ${productCategory} in ${normalizedCountryCode}: ${
        productCategoryData ? productCategoryData.productCategoryId : null
      }`,
      logContext,
      flushBuffer,
    );
  }

  return productCategoryData ? productCategoryData.productCategoryId : null;
}

module.exports = getProductCategoryId;

// getProductCategoryId('Livres', 'FR', true, 'getProductCategoryId', true).then(
//   result => {
//     console.log(result);
//   },
// );
