const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllEanInAsins = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }
  try {
    const eanInAsins = await db.EanInAsin.findAll({ limit });
    res.status(200).json(eanInAsins);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getEanInAsinById = async (req, res) => {
  try {
    const eanInAsin = await db.EanInAsin.findByPk(req.params.id);
    if (!eanInAsin) {
      return res.status(404).send({ error: 'EAN-ASIN association not found' });
    }
    res.status(200).json(eanInAsin);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createEanInAsin = async (req, res) => {
  try {
    const newEanInAsinData = {
      ...req.body,
      eanInAsinId: undefined, // Exclude 'eanInAsinId' as it is auto-incremented
    };
    const newEanInAsin = await db.EanInAsin.create(newEanInAsinData);
    res.status(201).json(newEanInAsin);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updateEanInAsin = async (req, res) => {
  const eanInAsinToUpdate = req.params.id;
  const updateData = req.body;

  try {
    const eanInAsin = await db.EanInAsin.findByPk(eanInAsinToUpdate);
    if (!eanInAsin) {
      return res.status(404).json({ error: 'EAN-ASIN association not found' });
    }
    Object.assign(eanInAsin, updateData);
    await eanInAsin.save();
    res.status(200).json({
      message: 'EAN-ASIN association updated successfully',
      eanInAsin,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deleteEanInAsin = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.EanInAsin.destroy({
      where: { eanInAsinId: req.params.id },
    });
    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ error: 'EAN-ASIN association not found' });
    }
    res
      .status(200)
      .json({ message: 'EAN-ASIN association deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
