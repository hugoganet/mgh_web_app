const db = require('../../database/models/index');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all ASIN Warehouse Quantities
exports.getAllAsinWarehouseQuantities = async (req, res) => {
  try {
    const asinWarehouseQuantities = await db.AsinWarehouseQuantity.findAll();
    res.status(200).json(asinWarehouseQuantities);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single ASIN Warehouse Quantity by its ID
exports.getAsinWarehouseQuantityById = async (req, res) => {
  try {
    const asinWarehouseQuantity = await db.AsinWarehouseQuantity.findByPk(
      req.params.asinId,
    );
    if (!asinWarehouseQuantity) {
      return res
        .status(404)
        .send({ error: 'ASIN Warehouse Quantity not found' });
    }
    res.status(200).json(asinWarehouseQuantity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
