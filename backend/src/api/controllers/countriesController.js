const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all Countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await db.Country.findAll();
    res.status(200).json(countries);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single Country by its code
exports.getCountryByCode = async (req, res) => {
  try {
    const country = await db.Country.findByPk(req.params.countryCode);
    if (!country) {
      return res.status(404).send({ error: 'Country not found' });
    }
    res.status(200).json(country);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new Country
exports.createCountry = async (req, res) => {
  try {
    const newCountry = await db.Country.create(req.body);
    res.status(201).json(newCountry);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing Country
exports.updateCountry = async (req, res) => {
  const countryCodeToUpdate = req.params.countryCode;
  const updateData = req.body;

  try {
    const country = await db.Country.findByPk(countryCodeToUpdate);
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    Object.assign(country, updateData);
    await country.save();
    res.status(200).json({ message: 'Country updated successfully', country });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a Country
exports.deleteCountry = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Country.destroy({
      where: { countryCode: req.params.countryCode },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.status(200).json({ message: 'Country deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
