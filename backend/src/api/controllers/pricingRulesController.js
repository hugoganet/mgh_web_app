const db = require('../models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all Pricing Rules
exports.getAllPricingRules = async (req, res) => {
  try {
    const pricingRules = await db.PricingRule.findAll();
    res.status(200).json(pricingRules);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single Pricing Rule by ID
exports.getPricingRuleById = async (req, res) => {
  try {
    const pricingRule = await db.PricingRule.findByPk(req.params.pricingRuleId);
    if (!pricingRule) {
      return res.status(404).send({ error: 'Pricing rule not found' });
    }
    res.status(200).json(pricingRule);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new Pricing Rule
exports.createPricingRule = async (req, res) => {
  try {
    const newPricingRuleData = {
      ...req.body,
      pricingRuleId: undefined,
    };

    const newPricingRule = await db.PricingRule.create(newPricingRuleData);
    res.status(201).json(newPricingRule);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing Pricing Rule
exports.updatePricingRule = async (req, res) => {
  const pricingRuleId = req.params.pricingRuleId;
  const updateData = req.body;

  try {
    const pricingRule = await db.PricingRule.findByPk(pricingRuleId);
    if (!pricingRule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    Object.assign(pricingRule, updateData);
    await pricingRule.save();
    res
      .status(200)
      .json({ message: 'Pricing rule updated successfully', pricingRule });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a Pricing Rule
exports.deletePricingRule = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.PricingRule.destroy({
      where: { pricingRuleId: req.params.pricingRuleId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    res.status(200).json({ message: 'Pricing rule deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
