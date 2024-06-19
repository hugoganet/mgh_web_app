const db = require('../../database/models/index');
const { ValidationError } = require('sequelize'); // Import for input validation errors

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// GET all SKUs with a limit
exports.getAllSkus = async (req, res) => {
  // const limit = parseInt(req.query.limit) || 50;

  // if (isNaN(limit)) {
  //   return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  // }

  try {
    const skus = await db.Sku.findAll();
    res.status(200).json(skus);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single SKU by its ID
exports.getSkuById = async (req, res) => {
  try {
    const sku = await db.Sku.findByPk(req.params.skuId);
    if (!sku) {
      return res.status(404).send({ error: 'SKU not found' });
    }
    res.status(200).json(sku);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new SKU
exports.createSku = async (req, res) => {
  try {
    // Create a new SKU with the data provided in the request body
    // Exclude 'skuId' as it is auto-incremented
    const newSkuData = {
      ...req.body,
      skuId: undefined, // Ensure skuId is not included
    };

    const newSku = await db.Sku.create(newSkuData);
    res.status(201).json(newSku);
  } catch (error) {
    // Handle validation errors or other types of errors
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// Update an existing SKU
exports.updateSku = async (req, res) => {
  const skuToUpdate = req.params.skuId;
  const updateData = req.body;

  try {
    // Retrieve the SKU instance
    const sku = await db.Sku.findByPk(skuToUpdate);
    if (!sku) {
      return res.status(404).json({ message: 'SKU not found' });
    }

    // Update the SKU properties
    Object.assign(sku, updateData);

    // Save the changes
    await sku.save();

    res.status(200).json({ message: 'SKU updated successfully', sku });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE a SKU
exports.deleteSku = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Sku.destroy({
      where: { skuId: req.params.skuId },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'SKU not found' });
    }

    res.status(200).json({ message: 'SKU deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
