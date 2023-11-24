const db = require('../models/index');
const { ValidationError } = require('sequelize');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging purposes
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all suppliers
exports.getAllSuppliers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }
  try {
    const suppliers = await db.Supplier.findAll({ limit });
    res.status(200).json(suppliers);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await db.Supplier.findByPk(req.params.supplierId);
    if (!supplier) {
      return res.status(404).send({ error: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new supplier
exports.createSupplier = async (req, res) => {
  try {
    // Create a new supplier with the data provided in the request body
    // Exclude 'supplierId' as it is auto-incremented
    const newSupplierData = {
      ...req.body,
      supplierId: undefined, // Ensure supplierId is not included
    };

    const newSupplier = await db.Supplier.create(newSupplierData);
    res.status(201).json(newSupplier);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH to update an existing supplier
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await db.Supplier.findByPk(req.params.supplierId);
    if (!supplier) {
      return res.status(404).send({ error: 'Supplier not found' });
    }

    // Update the supplier properties
    Object.assign(supplier, req.body);

    // Save the changes
    await supplier.save();
    res
      .status(200)
      .json({ message: 'Supplier updated successfully', supplier });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Supplier.destroy({
      where: { supplierId: req.params.supplierId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
