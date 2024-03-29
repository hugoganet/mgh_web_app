const db = require('../../database/models/index');
const { ValidationError } = require('sequelize'); // Import for input validation errors

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllAsins = async (req, res) => {
  try {
    const asins = await db.Asin.findAll();
    res.status(200).json(asins);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single ASIN by its ID
exports.getAsinById = async (req, res) => {
  try {
    const asin = await db.Asin.findByPk(req.params.asinId);
    if (!asin) {
      return res.status(404).send({ error: 'ASIN not found' });
    }
    res.status(200).json(asin);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new ASIN
exports.createAsin = async (req, res) => {
  try {
    // Create a new ASIN with the data provided in the request body
    // Exclude 'asinId' as it is auto-incremented
    const newAsinData = {
      ...req.body,
      asinId: undefined, // Ensure asinId is not included
    };

    const newAsin = await db.Asin.create(newAsinData);
    res.status(201).json(newAsin);
  } catch (error) {
    // Handle validation errors or other types of errors
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// Update an existing ASIN
exports.updateAsin = async (req, res) => {
  const asinToUpdate = req.params.asinId;
  const updateData = req.body;

  try {
    // Retrieve the ASIN instance
    const asin = await db.Asin.findByPk(asinToUpdate);
    if (!asin) {
      return res.status(404).json({ message: 'ASIN not found' });
    }

    // Update the ASIN properties
    Object.assign(asin, updateData);

    // Save the changes
    await asin.save();

    res.status(200).json({ message: 'ASIN updated successfully', asin });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE an ASIN
exports.deleteAsin = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Asin.destroy({
      where: { asinId: req.params.asinId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'ASIN not found' });
    }

    res.status(200).json({ message: 'ASIN deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
