const db = require('../models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllSupplierBrandCatalogs = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }
  try {
    const supplierBrandCatalogs = await db.SupplierBrandCatalog.findAll({
      limit,
    });
    res.status(200).json(supplierBrandCatalogs);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getSupplierBrandCatalogById = async (req, res) => {
  try {
    const supplierBrandCatalog = await db.SupplierBrandCatalog.findByPk(
      req.params.id,
    );
    if (!supplierBrandCatalog) {
      return res
        .status(404)
        .send({ error: 'Supplier-brand catalog not found' });
    }
    res.status(200).json(supplierBrandCatalog);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createSupplierBrandCatalog = async (req, res) => {
  try {
    const newSupplierBrandCatalogData = {
      ...req.body,
      supplierBrandCatalogId: undefined, // Exclude 'supplierBrandCatalogId' as it is auto-incremented
    };

    const newSupplierBrandCatalog = await db.SupplierBrandCatalog.create(
      newSupplierBrandCatalogData,
    );
    res.status(201).json(newSupplierBrandCatalog);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updateSupplierBrandCatalog = async (req, res) => {
  const supplierBrandCatalogToUpdate = req.params.id;
  const updateData = req.body;

  try {
    const supplierBrandCatalog = await db.SupplierBrandCatalog.findByPk(
      supplierBrandCatalogToUpdate,
    );
    if (!supplierBrandCatalog) {
      return res
        .status(404)
        .json({ error: 'Supplier-brand catalog not found' });
    }

    Object.assign(supplierBrandCatalog, updateData);
    await supplierBrandCatalog.save();
    res.status(200).json({
      message: 'Supplier-brand catalog updated successfully',
      supplierBrandCatalog,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deleteSupplierBrandCatalog = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.SupplierBrandCatalog.destroy({
      where: { supplierBrandCatalogId: req.params.id },
    });

    if (numberOfDeletedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Supplier-brand catalog not found' });
    }

    res
      .status(200)
      .json({ message: 'Supplier-brand catalog deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
