const db = require('../models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all mappings
exports.getAllMappings = async (req, res) => {
  try {
    const mappings = await db.ProductAndAmzReferralFeeCategory.findAll();
    res.status(200).json(mappings);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single mapping by its ID
exports.getMappingById = async (req, res) => {
  try {
    const mapping = await db.ProductAndAmzReferralFeeCategory.findByPk(
      req.params.mappingId,
    );
    if (!mapping) {
      return res.status(404).send({ error: 'Mapping not found' });
    }
    res.status(200).json(mapping);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new mapping
exports.createMapping = async (req, res) => {
  try {
    const newMappingData = {
      ...req.body,
      productAndAmzReferralFeeCategoryId: undefined,
    };

    const newMapping =
      await db.ProductAndAmzReferralFeeCategory.create(newMappingData);
    res.status(201).json(newMapping);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing mapping
exports.updateMapping = async (req, res) => {
  const productAndAmzReferralFeeCategoryId = req.params.mappingId;
  const updateData = req.body;

  try {
    const mapping = await db.ProductAndAmzReferralFeeCategory.findByPk(
      productAndAmzReferralFeeCategoryId,
    );
    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    Object.assign(mapping, updateData);
    await mapping.save();
    res.status(200).json({
      message: 'Mapping updated successfully',
      mapping,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a mapping
exports.deleteMapping = async (req, res) => {
  try {
    const numberOfDeletedRows =
      await db.ProductAndAmzReferralFeeCategory.destroy({
        where: {
          productAndAmzReferralFeeCategoryId: req.params.mappingId,
        },
      });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    res.status(200).json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
