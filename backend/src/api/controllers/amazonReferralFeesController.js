const db = require('../models/index');
const { ValidationError } = require('sequelize');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all Amazon referral fees
exports.getAllAmazonReferralFees = async (req, res) => {
  try {
    const amazonReferralFees = await db.AmazonReferralFee.findAll();
    res.status(200).json(amazonReferralFees);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single Amazon referral fee by its ID
exports.getAmazonReferralFeeById = async (req, res) => {
  try {
    const amazonReferralFee = await db.AmazonReferralFee.findByPk(
      req.params.referralFeeCategoryId,
    );
    if (!amazonReferralFee) {
      return res.status(404).send({ error: 'Amazon referral fee not found' });
    }
    res.status(200).json(amazonReferralFee);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new Amazon referral fee
exports.createAmazonReferralFee = async (req, res) => {
  try {
    const newAmazonReferralFeeData = {
      ...req.body,
      referralFeeCategoryId: undefined,
    };

    const newAmazonReferralFee = await db.AmazonReferralFee.create(
      newAmazonReferralFeeData,
    );
    res.status(201).json(newAmazonReferralFee);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing Amazon referral fee
exports.updateAmazonReferralFee = async (req, res) => {
  const referralFeeCategoryId = req.params.referralFeeCategoryId;
  const updateData = req.body;

  try {
    const amazonReferralFee = await db.AmazonReferralFee.findByPk(
      referralFeeCategoryId,
    );
    if (!amazonReferralFee) {
      return res.status(404).json({ message: 'Amazon referral fee not found' });
    }

    Object.assign(amazonReferralFee, updateData);
    await amazonReferralFee.save();
    res.status(200).json({
      message: 'Amazon referral fee updated successfully',
      amazonReferralFee,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE an Amazon referral fee
exports.deleteAmazonReferralFee = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.AmazonReferralFee.destroy({
      where: { referralFeeCategoryId: req.params.referralFeeCategoryId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Amazon referral fee not found' });
    }

    res
      .status(200)
      .json({ message: 'Amazon referral fee deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
