const db = require('../../database/models/index');
const { ValidationError } = require('sequelize'); // Import for input validation errors

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all Product Tax Categories
exports.getAllProductTaxCategories = async (req, res) => {
  try {
    const productTaxCategories = await db.ProductTaxCategory.findAll();
    res.status(200).json(productTaxCategories);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single Product Tax Category by ID
exports.getProductTaxCategoryById = async (req, res) => {
  try {
    const productTaxCategory = await db.ProductTaxCategory.findByPk(
      req.params.productTaxCategoryId,
    );
    if (!productTaxCategory) {
      return res.status(404).send({ error: 'Product Tax Category not found' });
    }
    res.status(200).json(productTaxCategory);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new Product Tax Category
exports.createProductTaxCategory = async (req, res) => {
  try {
    const newProductTaxCategoryData = {
      ...req.body,
      productTaxCategoryId: undefined, // Ignore ID if it's autoincremented
    };

    const newProductTaxCategory = await db.ProductTaxCategory.create(
      newProductTaxCategoryData,
    );
    res.status(201).json(newProductTaxCategory);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing Product Tax Category
exports.updateProductTaxCategory = async (req, res) => {
  const productTaxCategoryId = req.params.productTaxCategoryId;
  const updateData = req.body;

  try {
    const productTaxCategory =
      await db.ProductTaxCategory.findByPk(productTaxCategoryId);
    if (!productTaxCategory) {
      return res
        .status(404)
        .json({ message: 'Product Tax Category not found' });
    }

    Object.assign(productTaxCategory, updateData);
    await productTaxCategory.save();
    res.status(200).json({
      message: 'Product Tax Category updated successfully',
      productTaxCategory,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a Product Tax Category
exports.deleteProductTaxCategory = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.ProductTaxCategory.destroy({
      where: { productTaxCategoryId: req.params.productTaxCategoryId },
    });

    if (numberOfDeletedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Product Tax Category not found' });
    }

    res
      .status(200)
      .json({ message: 'Product Tax Category deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
