const db = require('../models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllPriceGridFbaFees = async (req, res) => {
  try {
    const priceGridFbaFees = await db.PriceGridFbaFee.findAll();
    res.status(200).json(priceGridFbaFees);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getPriceGridFbaFeeById = async (req, res) => {
  try {
    const priceGridFbaFee = await db.PriceGridFbaFee.findByPk(
      req.params.priceGridFbaFeeId,
    );
    if (!priceGridFbaFee) {
      return res.status(404).send({ error: 'Price grid FBA fee not found' });
    }
    res.status(200).json(priceGridFbaFee);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createPriceGridFbaFee = async (req, res) => {
  try {
    const newPriceGridFbaFeeData = {
      ...req.body,
      priceGridFbaFeeId: undefined, // Ignoring ID for autoincrement
    };

    const newPriceGridFbaFee = await db.PriceGridFbaFee.create(
      newPriceGridFbaFeeData,
    );
    res.status(201).json(newPriceGridFbaFee);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updatePriceGridFbaFee = async (req, res) => {
  const priceGridFbaFeeId = req.params.priceGridFbaFeeId;
  const updateData = req.body;

  try {
    const priceGridFbaFee =
      await db.PriceGridFbaFee.findByPk(priceGridFbaFeeId);
    if (!priceGridFbaFee) {
      return res.status(404).send({ error: 'Price grid FBA fee not found' });
    }

    Object.assign(priceGridFbaFee, updateData);
    await priceGridFbaFee.save();
    res.status(200).json({
      message: 'Price grid FBA fee updated successfully',
      priceGridFbaFee,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deletePriceGridFbaFee = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.PriceGridFbaFee.destroy({
      where: { priceGridFbaFeeId: req.params.priceGridFbaFeeId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Price grid FBA fee not found' });
    }

    res
      .status(200)
      .json({ message: 'Price grid FBA fee deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
