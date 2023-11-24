const db = require('../models/index');
const { ValidationError } = require('sequelize');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all SKUs
exports.getAllSkus = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }

  try {
    const skus = await db.Sku.findAll({ limit });
    res.status(200).json(skus);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single SKU by its ID
exports.getSkuById = async (req, res) => {
  try {
    const sku = await db.Sku.findByPk(req.params.skuId);
    if (!sku) {
      return res.status(404).send({ error: 'SKU not found' });
    }
    res.status(200).json(sku);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new SKU
exports.createSku = async (req, res) => {
  try {
    const newSkuData = {
      ...req.body,
      skuId: undefined,
    };

    const newSku = await db.Sku.create(newSkuData);
    res.status(201).json(newSku);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// Update an existing SKU
exports.updateSku = async (req, res) => {
  try {
    const sku = await db.Sku.findByPk(req.params.skuId);
    if (!sku) {
      return res.status(404).send({ error: 'SKU not found' });
    }

    Object.assign(sku, req.body);
    await sku.save();

    res.status(200).json({ message: 'SKU updated successfully' });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a SKU
exports.deleteSku = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Sku.destroy({
      where: { skuId: req.params.skuId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ error: 'SKU not found' });
    }

    res.status(200).json({ message: 'SKU deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
