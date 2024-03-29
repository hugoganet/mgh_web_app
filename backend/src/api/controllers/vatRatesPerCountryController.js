const db = require('../../database/models/index');
const { ValidationError } = require('sequelize'); // Import for input validation errors

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all VAT rates per country
exports.getAllVatRatesPerCountry = async (req, res) => {
  try {
    const vatRatesPerCountry = await db.VatRatePerCountry.findAll();
    res.status(200).json(vatRatesPerCountry);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single VAT rate per country by ID
exports.getVatRatePerCountryById = async (req, res) => {
  try {
    const vatRatePerCountry = await db.VatRatePerCountry.findByPk(
      req.params.vatRatePerCountryId,
    );
    if (!vatRatePerCountry) {
      return res.status(404).send({ error: 'VAT rate per country not found' });
    }
    res.status(200).json(vatRatePerCountry);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new VAT rate per country
exports.createVatRatePerCountry = async (req, res) => {
  try {
    const newVatRatePerCountryData = {
      ...req.body,
      vatRatePerCountryId: undefined, // Ignore ID if it's autoincremented
    };

    const newVatRatePerCountry = await db.VatRatePerCountry.create(
      newVatRatePerCountryData,
    );
    res.status(201).json(newVatRatePerCountry);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing VAT rate per country
exports.updateVatRatePerCountry = async (req, res) => {
  const vatRatePerCountryId = req.params.vatRatePerCountryId;
  const updateData = req.body;

  try {
    const vatRatePerCountry =
      await db.VatRatePerCountry.findByPk(vatRatePerCountryId);
    if (!vatRatePerCountry) {
      return res
        .status(404)
        .json({ message: 'VAT rate per country not found' });
    }

    Object.assign(vatRatePerCountry, updateData);
    await vatRatePerCountry.save();
    res.status(200).json({
      message: 'VAT rate per country updated successfully',
      vatRatePerCountry,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a VAT rate per country
exports.deleteVatRatePerCountry = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.VatRatePerCountry.destroy({
      where: { vatRatePerCountryId: req.params.vatRatePerCountryId },
    });

    if (numberOfDeletedRows === 0) {
      return res
        .status(404)
        .json({ message: 'VAT rate per country not found' });
    }

    res
      .status(200)
      .json({ message: 'VAT rate per country deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
