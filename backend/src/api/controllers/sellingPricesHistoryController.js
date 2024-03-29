const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all Selling Prices History
exports.getAllSellingPricesHistory = async (req, res) => {
  try {
    const sellingPricesHistory = await db.SellingPriceHistory.findAll();
    res.status(200).json(sellingPricesHistory);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single Selling Price History by SKU ID and date
exports.getSellingPriceHistoryById = async (req, res) => {
  try {
    const { skuId, date } = req.params;
    const sellingPriceHistory = await db.SellingPriceHistory.findOne({
      where: { skuId, date },
    });
    if (!sellingPriceHistory) {
      return res.status(404).send({ error: 'Selling price history not found' });
    }
    res.status(200).json(sellingPriceHistory);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new Selling Price History
exports.createSellingPriceHistory = async (req, res) => {
  try {
    const newSellingPriceHistoryData = {
      ...req.body,
    };

    const newSellingPriceHistory = await db.SellingPriceHistory.create(
      newSellingPriceHistoryData,
    );
    res.status(201).json(newSellingPriceHistory);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing Selling Price History
exports.updateSellingPriceHistory = async (req, res) => {
  try {
    const { skuId, date } = req.params;
    const [updated] = await db.SellingPriceHistory.update(req.body, {
      where: { skuId, date },
    });
    if (updated) {
      const updatedRecord = await db.SellingPriceHistory.findOne({
        where: { skuId, date },
      });
      res.status(200).json({
        message: 'Selling price history updated successfully',
        updatedRecord,
      });
    } else {
      res.status(404).json({ message: 'Selling price history not found' });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a Selling Price History
exports.deleteSellingPriceHistory = async (req, res) => {
  try {
    const { skuId, date } = req.params;
    const deleted = await db.SellingPriceHistory.destroy({
      where: { skuId, date },
    });
    if (deleted) {
      res
        .status(200)
        .json({ message: 'Selling price history deleted successfully' });
    } else {
      res.status(404).json({ message: 'Selling price history not found' });
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
