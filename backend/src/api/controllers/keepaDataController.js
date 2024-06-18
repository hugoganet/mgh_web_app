const db = require('../../database/models/index');
const { ValidationError } = require('sequelize'); // Import for input validation errors

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllKeepaData = async (req, res) => {
  try {
    const keepaData = await db.KeepaData.findAll();
    res.status(200).json(keepaData);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single Keepa data entry by its ID
exports.getKeepaDataById = async (req, res) => {
  try {
    const keepaData = await db.KeepaData.findByPk(req.params.keepaDataId);
    if (!keepaData) {
      return res.status(404).send({ error: 'Keepa data not found' });
    }
    res.status(200).json(keepaData);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new Keepa data entry
exports.createKeepaData = async (req, res) => {
  try {
    // Create a new Keepa data entry with the data provided in the request body
    const newKeepaData = await db.KeepaData.create(req.body);
    res.status(201).json(newKeepaData);
  } catch (error) {
    // Handle validation errors or other types of errors
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// Update an existing Keepa data entry
exports.updateKeepaData = async (req, res) => {
  const keepaDataId = req.params.keepaDataId;
  const updateData = req.body;

  try {
    // Retrieve the Keepa data instance
    const keepaData = await db.KeepaData.findByPk(keepaDataId);
    if (!keepaData) {
      return res.status(404).json({ message: 'Keepa data not found' });
    }

    // Update the Keepa data properties
    Object.assign(keepaData, updateData);

    // Save the changes
    await keepaData.save();

    res
      .status(200)
      .json({ message: 'Keepa data updated successfully', keepaData });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a Keepa data entry
exports.deleteKeepaData = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.KeepaData.destroy({
      where: { keepaDataId: req.params.keepaDataId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'Keepa data not found' });
    }

    res.status(200).json({ message: 'Keepa data deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
