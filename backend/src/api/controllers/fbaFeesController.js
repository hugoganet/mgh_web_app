const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

// Function to handle error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all FBA fees
exports.getAllFbaFees = async (req, res) => {
  const limit = req.query.limit || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }
  try {
    const fbaFees = await db.FbaFee.findAll({ limit });
    res.status(200).json(fbaFees);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single FBA fee by ID
exports.getFbaFeeById = async (req, res) => {
  try {
    const fbaFee = await db.FbaFee.findByPk(req.params.fbaFeeId);
    if (!fbaFee) {
      return res.status(404).send({ error: 'FBA Fee not found' });
    }
    res.status(200).json(fbaFee);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new FBA fee
exports.createFbaFee = async (req, res) => {
  try {
    const newFbaFee = await db.FbaFee.create({
      ...req.body,
      fbaFeeId: undefined, // Ensuring fbaFeeId is not included as it's autoincremented
    });
    res.status(201).json(newFbaFee);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH to update an existing FBA fee
exports.updateFbaFee = async (req, res) => {
  try {
    const fbaFee = await db.FbaFee.findByPk(req.params.fbaFeeId);
    if (!fbaFee) {
      return res.status(404).send({ error: 'FBA Fee not found' });
    }

    await fbaFee.update(req.body);
    res.status(200).json({ message: 'FBA Fee updated successfully', fbaFee });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a FBA fee
exports.deleteFbaFee = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.FbaFee.destroy({
      where: { fbaFeeId: req.params.fbaFeeId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'FBA Fee not found' });
    }

    res.status(200).json({ message: 'FBA Fee deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
