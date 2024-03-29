const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all warehouse stocks
exports.getAllWarehouseStocks = async (req, res) => {
  const limit = req.query.limit || 50;

  if (isNaN(limit)) {
    return res.status(400).json({ error: 'Invalid input for limit' });
  }
  try {
    const warehouseStocks = await db.WarehouseStock.findAll({ limit });
    res.status(200).json(warehouseStocks);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single warehouse stock by its ID
exports.getWarehouseStockById = async (req, res) => {
  try {
    const warehouseStock = await db.WarehouseStock.findByPk(
      req.params.warehouseStockId,
    );
    if (!warehouseStock) {
      return res.status(404).send({ error: 'Warehouse stock not found' });
    }
    res.status(200).json(warehouseStock);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new warehouse stock
exports.createWarehouseStock = async (req, res) => {
  try {
    const newWarehouseStockData = {
      ...req.body,
      warehouseStockId: undefined, // Ensure autoincrement ID is not manually set
    };

    const newWarehouseStock = await db.WarehouseStock.create(
      newWarehouseStockData,
    );
    res.status(201).json(newWarehouseStock);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing warehouse stock
exports.updateWarehouseStock = async (req, res) => {
  const warehouseStockId = req.params.warehouseStockId;
  const updateData = req.body;

  try {
    const warehouseStock = await db.WarehouseStock.findByPk(warehouseStockId);
    if (!warehouseStock) {
      return res.status(404).json({ message: 'Warehouse stock not found' });
    }

    Object.assign(warehouseStock, updateData);
    await warehouseStock.save();
    res.status(200).json({
      message: 'Warehouse stock updated successfully',
      warehouseStock,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a warehouse stock
exports.deleteWarehouseStock = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.WarehouseStock.destroy({
      where: { warehouseStockId: req.params.warehouseStockId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Warehouse stock not found' });
    }

    res.status(200).json({ message: 'Warehouse stock deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
