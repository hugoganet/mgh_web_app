const db = require('../models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllMinimumSellingPrices = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }
  try {
    const minimumSellingPrices = await db.MinimumSellingPrice.findAll({
      limit,
    });
    res.status(200).json(minimumSellingPrices);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getMinimumSellingPriceById = async (req, res) => {
  try {
    const minimumSellingPrice = await db.MinimumSellingPrice.findByPk(
      req.params.minimumSellingPriceId,
    );
    if (!minimumSellingPrice) {
      return res.status(404).send({ error: 'Minimum Selling Price not found' });
    }
    res.status(200).json(minimumSellingPrice);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createMinimumSellingPrice = async (req, res) => {
  try {
    const newMinimumSellingPriceData = {
      ...req.body,
      minimumSellingPriceId: undefined,
    };

    const newMinimumSellingPrice = await db.MinimumSellingPrice.create(
      newMinimumSellingPriceData,
    );
    res.status(201).json(newMinimumSellingPrice);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updateMinimumSellingPrice = async (req, res) => {
  try {
    const minimumSellingPrice = await db.MinimumSellingPrice.findByPk(
      req.params.minimumSellingPriceId,
    );
    if (!minimumSellingPrice) {
      return res.status(404).send({ error: 'Minimum Selling Price not found' });
    }

    Object.assign(minimumSellingPrice, req.body);
    await minimumSellingPrice.save();
    res.status(200).json({
      message: 'Minimum Selling Price updated successfully',
      minimumSellingPrice,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deleteMinimumSellingPrice = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.MinimumSellingPrice.destroy({
      where: { minimumSellingPriceId: req.params.minimumSellingPriceId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ error: 'Minimum Selling Price not found' });
    }

    res
      .status(200)
      .json({ message: 'Minimum Selling Price deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
