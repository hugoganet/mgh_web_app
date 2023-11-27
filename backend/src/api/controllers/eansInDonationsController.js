const db = require('../models/index');
const { ValidationError } = require('sequelize');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all EANs in donations
exports.getAllEansInDonations = async (req, res) => {
  const limit = req.query.limit || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }
  try {
    const eansInDonations = await db.EanInDonation.findAll({ limit });
    res.status(200).json(eansInDonations);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single EAN in donation by ID
exports.getEanInDonationById = async (req, res) => {
  try {
    const eanInDonation = await db.EanInDonation.findByPk(
      req.params.eanInDonationId,
    );
    if (!eanInDonation) {
      return res.status(404).send({ error: 'EAN in donation not found' });
    }
    res.status(200).json(eanInDonation);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new EAN in donation
exports.createEanInDonation = async (req, res) => {
  try {
    const newEanInDonationData = {
      ean: req.body.ean,
      donationId: req.body.donationId,
      eanDonationQuantity: req.body.eanDonationQuantity,
    };

    const newEanInDonation =
      await db.EanInDonation.create(newEanInDonationData);
    res.status(201).json(newEanInDonation);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing EAN in donation
exports.updateEanInDonation = async (req, res) => {
  const eanInDonationId = req.params.eanInDonationId;

  try {
    const eanInDonation = await db.EanInDonation.findByPk(eanInDonationId);
    if (!eanInDonation) {
      return res.status(404).json({ message: 'EAN in donation not found' });
    }

    // Update only the properties provided in the request body
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        eanInDonation[key] = req.body[key];
      }
    }

    await eanInDonation.save();

    res
      .status(200)
      .json({ message: 'EAN in donation updated successfully', eanInDonation });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE an EAN in donation
exports.deleteEanInDonation = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.EanInDonation.destroy({
      where: { eanInDonationId: req.params.eanInDonationId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'EAN in donation not found' });
    }

    res.status(200).json({ message: 'EAN in donation deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
