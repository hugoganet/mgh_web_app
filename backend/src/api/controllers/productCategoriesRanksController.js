const db = require('../models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllProductCategoryRanks = async (req, res) => {
  try {
    const productCategoryRanks = await db.ProductCategoryRank.findAll();
    res.status(200).json(productCategoryRanks);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getProductCategoryRankById = async (req, res) => {
  try {
    const productCategoryRank = await db.ProductCategoryRank.findByPk(
      req.params.productCategoryRankId,
    );
    if (!productCategoryRank) {
      return res.status(404).send({ error: 'Product Category Rank not found' });
    }
    res.status(200).json(productCategoryRank);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createProductCategoryRank = async (req, res) => {
  try {
    const newProductCategoryRankData = {
      ...req.body,
      productCategoryRankId: undefined,
    };

    const newProductCategoryRank = await db.ProductCategoryRank.create(
      newProductCategoryRankData,
    );
    res.status(201).json(newProductCategoryRank);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updateProductCategoryRank = async (req, res) => {
  const rankToUpdate = req.params.productCategoryRankId;
  const updateData = req.body;

  try {
    const rank = await db.ProductCategoryRank.findByPk(rankToUpdate);
    if (!rank) {
      return res
        .status(404)
        .json({ message: 'Product Category Rank not found' });
    }

    Object.assign(rank, updateData);
    await rank.save();
    res
      .status(200)
      .json({ message: 'Product Category Rank updated successfully', rank });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deleteProductCategoryRank = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.ProductCategoryRank.destroy({
      where: { productCategoryRankId: req.params.productCategoryRankId },
    });

    if (numberOfDeletedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Product Category Rank not found' });
    }

    res
      .status(200)
      .json({ message: 'Product Category Rank deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
