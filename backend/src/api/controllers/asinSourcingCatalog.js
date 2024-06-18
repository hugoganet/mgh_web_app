const db = require('../../database/models/index');
const { ValidationError } = require('sequelize'); // Import for input validation errors

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllAsinSourcingCatalog = async (req, res) => {
  try {
    const asinSourcingCatalog = await db.AsinSourcingCatalog.findAll();
    res.status(200).json(asinSourcingCatalog);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single ASIN Sourcing Catalog entry by its ID
exports.getAsinSourcingCatalogById = async (req, res) => {
  try {
    const asinSourcingCatalog = await db.AsinSourcingCatalog.findByPk(
      req.params.asinSourcingCatalogId,
    );
    if (!asinSourcingCatalog) {
      return res
        .status(404)
        .send({ error: 'ASIN Sourcing Catalog entry not found' });
    }
    res.status(200).json(asinSourcingCatalog);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new ASIN Sourcing Catalog entry
exports.createAsinSourcingCatalog = async (req, res) => {
  try {
    // Create a new ASIN Sourcing Catalog entry with the data provided in the request body
    const newAsinSourcingCatalog = await db.AsinSourcingCatalog.create(
      req.body,
    );
    res.status(201).json(newAsinSourcingCatalog);
  } catch (error) {
    // Handle validation errors or other types of errors
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// Update an existing ASIN Sourcing Catalog entry
exports.updateAsinSourcingCatalog = async (req, res) => {
  const asinSourcingCatalogId = req.params.asinSourcingCatalogId;
  const updateData = req.body;

  try {
    // Retrieve the ASIN Sourcing Catalog instance
    const asinSourcingCatalog = await db.AsinSourcingCatalog.findByPk(
      asinSourcingCatalogId,
    );
    if (!asinSourcingCatalog) {
      return res
        .status(404)
        .json({ message: 'ASIN Sourcing Catalog entry not found' });
    }

    // Update the ASIN Sourcing Catalog properties
    Object.assign(asinSourcingCatalog, updateData);

    // Save the changes
    await asinSourcingCatalog.save();

    res.status(200).json({
      message: 'ASIN Sourcing Catalog entry updated successfully',
      asinSourcingCatalog,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE an ASIN Sourcing Catalog entry
exports.deleteAsinSourcingCatalog = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.AsinSourcingCatalog.destroy({
      where: { asinSourcingCatalogId: req.params.asinSourcingCatalogId },
    });

    if (numberOfDeletedRows === 0) {
      return res
        .status(404)
        .json({ message: 'ASIN Sourcing Catalog entry not found' });
    }

    res
      .status(200)
      .json({ message: 'ASIN Sourcing Catalog entry deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
