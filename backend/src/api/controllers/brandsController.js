const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await db.Brand.findAll();
    res.status(200).json(brands);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await db.Brand.findByPk(req.params.brandId);
    if (!brand) {
      return res.status(404).send({ error: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createBrand = async (req, res) => {
  try {
    const newBrandData = {
      ...req.body,
      brandId: undefined, // Ensuring autoincrement ID is not manually set
    };

    const newBrand = await db.Brand.create(newBrandData);
    res.status(201).json(newBrand);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const brand = await db.Brand.findByPk(req.params.brandId);
    if (!brand) {
      return res.status(404).send({ error: 'Brand not found' });
    }

    Object.assign(brand, req.body);
    await brand.save();
    res.status(200).json(brand);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Brand.destroy({
      where: { brandId: req.params.brandId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).send({ error: 'Brand not found' });
    }

    res.status(200).send({ message: 'Brand deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
