const db = require('../models/index'); // Import the sequelize models and instance

// GET all EANs
exports.getAllEans = async (req, res) => {
  try {
    // Retrieve all EANs from the database
    const eans = await db.Ean.findAll();
    // Send the retrieved EANs as a JSON response
    res.status(200).json(eans);
  } catch (error) {
    // In case of an error, send a 500 status code and the error message
    res.status(500).send(error.message);
  }
};

// GET a single EAN by its ID
exports.getEanById = async (req, res) => {
  try {
    // Retrieve a specific EAN by its ID (provided in the URL)
    const ean = await Ean.findByPk(req.params.eanId);
    // If the EAN is not found, return a 404 error
    if (!ean) {
      return res.status(404).send('EAN not found');
    }
    // Send the retrieved EAN as a JSON response
    res.status(200).json(ean);
  } catch (error) {
    // In case of an error, send a 500 status code and the error message
    res.status(500).send(error.message);
  }
};

// POST a new EAN
exports.createEan = async (req, res) => {
  try {
    // Create a new EAN with the data provided in the request body
    const newEan = await Ean.create(req.body);
    // Send the created EAN as a JSON response with a 201 status code
    res.status(201).json(newEan);
  } catch (error) {
    // In case of an error, send a 500 status code and the error message
    res.status(500).send(error.message);
  }
};

// PUT (update) an existing EAN
exports.updateEan = async (req, res) => {
  try {
    // Update an existing EAN identified by its ID with the data provided in the request body
    const updatedEan = await Ean.update(req.body, {
      where: { ean: req.params.eanId },
    });
    // If the EAN is not found, return a 404 error
    if (!updatedEan) {
      return res.status(404).send('EAN not found');
    }
    // Send the updated EAN as a JSON response
    res.status(200).json(updatedEan);
  } catch (error) {
    // In case of an error, send a 500 status code and the error message
    res.status(500).send(error.message);
  }
};

// DELETE an EAN
exports.deleteEan = async (req, res) => {
  try {
    // Delete an existing EAN identified by its ID
    const ean = await Ean.destroy({
      where: { ean: req.params.eanId },
    });
    // If the EAN is not found, return a 404 error
    if (!ean) {
      return res.status(404).send('EAN not found');
    }
    // Send a success message
    res.status(200).send('EAN deleted successfully');
  } catch (error) {
    // In case of an error, send a 500 status code and the error message
    res.status(500).send(error.message);
  }
};
