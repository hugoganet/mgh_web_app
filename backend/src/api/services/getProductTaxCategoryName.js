const db = require('../models/index');

/**
 * @function getProductTaxCategoryName
 * @param {number} productTaxCategoryId
 * @return {Promise<string>} productTaxCategoryName
 */
async function getProductTaxCategoryName(productTaxCategoryId) {
  const productTaxCategory = await db.ProductTaxCategory.findOne({
    where: {
      productTaxCategoryId: productTaxCategoryId,
    },
  });

  if (productTaxCategory) {
    return productTaxCategory.productTaxCategoryName;
  } else {
    console.log(
      `No product tax category found for ID: ${productTaxCategoryId}`,
    );
    return null;
  }
}

module.exports = {
  getProductTaxCategoryName,
};
