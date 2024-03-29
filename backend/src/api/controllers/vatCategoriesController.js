const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all VAT Categories
exports.getAllVatCategories = async (req, res) => {
  try {
    const vatCategories = await db.VatCategory.findAll();
    res.status(200).json(vatCategories);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single VAT Category by ID
exports.getVatCategoryById = async (req, res) => {
  try {
    const vatCategory = await db.VatCategory.findByPk(req.params.vatCategoryId);
    if (!vatCategory) {
      return res.status(404).send({ error: 'VAT category not found' });
    }
    res.status(200).json(vatCategory);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new VAT Category
exports.createVatCategory = async (req, res) => {
  try {
    const newVatCategory = await db.VatCategory.create(req.body);
    res.status(201).json(newVatCategory);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing VAT Category
exports.updateVatCategory = async (req, res) => {
  const vatCategoryId = req.params.vatCategoryId;
  const updateData = req.body;

  try {
    const vatCategory = await db.VatCategory.findByPk(vatCategoryId);
    if (!vatCategory) {
      return res.status(404).json({ message: 'VAT category not found' });
    }

    Object.assign(vatCategory, updateData);
    await vatCategory.save();
    res
      .status(200)
      .json({ message: 'VAT category updated successfully', vatCategory });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a VAT Category
exports.deleteVatCategory = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.VatCategory.destroy({
      where: { vatCategoryId: req.params.vatCategoryId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'VAT category not found' });
    }

    res.status(200).json({ message: 'VAT category deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
