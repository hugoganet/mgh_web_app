const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllCatalogEntries = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }

  try {
    const catalogEntries = await db.Catalog.findAll({ limit });
    res.status(200).json(catalogEntries);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getCatalogEntryById = async (req, res) => {
  try {
    const catalogEntry = await db.Catalog.findByPk(req.params.catalogId);
    if (!catalogEntry) {
      return res.status(404).send({ error: 'Catalog entry not found' });
    }
    res.status(200).json(catalogEntry);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createCatalogEntry = async (req, res) => {
  try {
    const newCatalogData = {
      ...req.body,
      catalogId: undefined, // Ensure auto-incremented ID is not included
    };

    const newCatalogEntry = await db.Catalog.create(newCatalogData);
    res.status(201).json(newCatalogEntry);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updateCatalogEntry = async (req, res) => {
  try {
    const catalogEntry = await db.Catalog.findByPk(req.params.catalogId);
    if (!catalogEntry) {
      return res.status(404).send({ error: 'Catalog entry not found' });
    }

    Object.assign(catalogEntry, req.body);
    await catalogEntry.save();
    res
      .status(200)
      .json({ message: 'Catalog entry updated successfully', catalogEntry });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deleteCatalogEntry = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Catalog.destroy({
      where: { catalogId: req.params.catalogId },
    });
    if (numberOfDeletedRows === 0) {
      return res.status(404).send({ error: 'Catalog entry not found' });
    }
    res.status(200).send({ message: 'Catalog entry deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
