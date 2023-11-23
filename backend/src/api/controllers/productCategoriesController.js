const db = require('../models/index');
const { ValidationError } = require('sequelize');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all Product Categories
exports.getAllProductCategories = async (req, res) => {
  try {
    const productCategories = await db.ProductCategory.findAll();
    res.status(200).json(productCategories);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single Product Category by ID
exports.getProductCategoryById = async (req, res) => {
  try {
    const productCategory = await db.ProductCategory.findByPk(
      req.params.productCategoryId,
    );
    if (!productCategory) {
      return res.status(404).send({ error: 'Product category not found' });
    }
    res.status(200).json(productCategory);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new Product Category
exports.createProductCategory = async (req, res) => {
  try {
    const newProductCategoryData = {
      ...req.body,
      productCategoryId: undefined, // Ignoring autoincrement ID
    };

    const newProductCategory = await db.ProductCategory.create(
      newProductCategoryData,
    );
    res.status(201).json(newProductCategory);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing Product Category
exports.updateProductCategory = async (req, res) => {
  try {
    const productCategory = await db.ProductCategory.findByPk(
      req.params.productCategoryId,
    );
    if (!productCategory) {
      return res.status(404).send({ error: 'Product category not found' });
    }

    Object.assign(productCategory, req.body);
    await productCategory.save();
    res.status(200).json(productCategory);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a Product Category
exports.deleteProductCategory = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.ProductCategory.destroy({
      where: { productCategoryId: req.params.productCategoryId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).send({ error: 'Product category not found' });
    }

    res.status(200).send({ message: 'Product category deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
