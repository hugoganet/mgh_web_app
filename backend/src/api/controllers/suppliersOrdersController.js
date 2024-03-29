const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

// Function to handle error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all supplier orders
exports.getAllSupplierOrders = async (req, res) => {
  const limit = req.query.limit || 10;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }
  try {
    const supplierOrders = await db.SupplierOrder.findAll({ limit });
    res.status(200).json(supplierOrders);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single supplier order by ID
exports.getSupplierOrderById = async (req, res) => {
  try {
    const supplierOrder = await db.SupplierOrder.findByPk(
      req.params.supplierOrderId,
    );
    if (!supplierOrder) {
      return res.status(404).send({ error: 'Supplier order not found' });
    }
    res.status(200).json(supplierOrder);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new supplier order
exports.createSupplierOrder = async (req, res) => {
  try {
    const newSupplierOrderData = {
      ...req.body,
      supplierOrderId: undefined,
    };

    const newSupplierOrder =
      await db.SupplierOrder.create(newSupplierOrderData);
    res.status(201).json(newSupplierOrder);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH to update an existing supplier order
exports.updateSupplierOrder = async (req, res) => {
  try {
    const supplierOrder = await db.SupplierOrder.findByPk(
      req.params.supplierOrderId,
    );
    if (!supplierOrder) {
      return res.status(404).send({ error: 'Supplier order not found' });
    }

    await supplierOrder.update(req.body);
    res
      .status(200)
      .json({ message: 'Supplier order updated successfully', supplierOrder });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a supplier order
exports.deleteSupplierOrder = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.SupplierOrder.destroy({
      where: { supplierOrderId: req.params.supplierOrderId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Supplier order not found' });
    }

    res.status(200).json({ message: 'Supplier order deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
