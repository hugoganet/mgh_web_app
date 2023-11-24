const db = require('../models/index');
const { ValidationError } = require('sequelize');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await db.Donation.findAll();
    res.status(200).json(donations);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await db.Donation.findByPk(req.params.donationId);
    if (!donation) {
      return res.status(404).send({ error: 'Donation not found' });
    }
    res.status(200).json(donation);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new donation
exports.createDonation = async (req, res) => {
  try {
    const newDonationData = {
      ...req.body,
      donationId: undefined, // Ensure donationId is not included
    };

    const newDonation = await db.Donation.create(newDonationData);
    res.status(201).json(newDonation);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH to update an existing donation
exports.updateDonation = async (req, res) => {
  try {
    const donation = await db.Donation.findByPk(req.params.donationId);
    if (!donation) {
      return res.status(404).send({ error: 'Donation not found' });
    }

    Object.assign(donation, req.body);
    await donation.save();
    res
      .status(200)
      .json({ message: 'Donation updated successfully', donation });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a donation
exports.deleteDonation = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Donation.destroy({
      where: { donationId: req.params.donationId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
