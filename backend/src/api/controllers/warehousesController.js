const db = require('../../database/models/index');
const { ValidationError } = require('sequelize'); // Import for input validation errors

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all Warehouses
exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await db.Warehouse.findAll();
    res.status(200).json(warehouses);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single Warehouse by its ID
exports.getWarehouseById = async (req, res) => {
  try {
    const warehouse = await db.Warehouse.findByPk(req.params.warehouseId);
    if (!warehouse) {
      return res.status(404).send({ error: 'Warehouse not found' });
    }
    res.status(200).json(warehouse);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new Warehouse
exports.createWarehouse = async (req, res) => {
  try {
    const newWarehouseData = {
      ...req.body,
      warehouseId: undefined, // Ensure warehouseId is not included
    };

    const newWarehouse = await db.Warehouse.create(newWarehouseData);
    res.status(201).json(newWarehouse);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing Warehouse
exports.updateWarehouse = async (req, res) => {
  const warehouseToUpdate = req.params.warehouseId;
  const updateData = req.body;

  try {
    const warehouse = await db.Warehouse.findByPk(warehouseToUpdate);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    Object.assign(warehouse, updateData);
    await warehouse.save();
    res
      .status(200)
      .json({ message: 'Warehouse updated successfully', warehouse });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a Warehouse
exports.deleteWarehouse = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Warehouse.destroy({
      where: { warehouseId: req.params.warehouseId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    res.status(200).json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
