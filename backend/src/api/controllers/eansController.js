const db = require('../../database/models/index');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error); // Log the error for debugging
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

exports.getAllEans = async (req, res) => {
  try {
    const eans = await db.Ean.findAll({
      include: [
        {
          model: db.WarehouseStock,
          include: [{ model: db.Warehouse, attributes: ['warehouseName'] }],
        },
      ],
    });

    const transformedEans = eans.map(ean => {
      const stockLevels = {};
      ean.WarehouseStocks.forEach(stock => {
        const warehouseName = stock.Warehouse.warehouseName;
        stockLevels[`stock_${warehouseName}`] = stock.warehouseInStockQuantity;
      });

      return {
        ...ean.get({ plain: true }),
        ...stockLevels,
      };
    });

    const warehouses = await db.Warehouse.findAll({
      attributes: ['warehouseName'],
    });

    res.status(200).json({
      data: transformedEans,
      warehouses: warehouses.map(wh => wh.warehouseName),
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getEanById = async (req, res) => {
  try {
    const ean = await db.Ean.findByPk(req.params.ean, {
      include: [
        {
          model: db.WarehouseStock,
          include: [
            {
              model: db.Warehouse,
              attributes: ['warehouseName'],
            },
          ],
        },
      ],
    });

    if (!ean) {
      return res.status(404).send({ error: 'EAN not found' });
    }

    // Transform the EAN data to include stock levels for each warehouse
    const stockLevels = {};
    ean.WarehouseStocks.forEach(stock => {
      const warehouseName = stock.Warehouse.warehouseName;
      stockLevels[`stock_${warehouseName}`] = stock.warehouseInStockQuantity;
    });

    const transformedEan = {
      ...ean.get({ plain: true }),
      ...stockLevels,
    };

    res.status(200).json(transformedEan);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createEan = async (req, res) => {
  try {
    const newEan = await db.Ean.create(req.body);
    res.status(201).json(newEan);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updateEan = async (req, res) => {
  const eanToUpdate = req.params.ean;
  const updateData = req.body;

  try {
    // Retrieve the EAN instance
    const ean = await db.Ean.findByPk(eanToUpdate);
    if (!ean) {
      return res.status(404).json({ message: 'EAN not found' });
    }

    // Update the EAN properties
    Object.assign(ean, updateData);

    // Save the changes
    await ean.save();

    res.status(200).json({ message: 'EAN updated successfully', ean });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400); // Bad request for validation errors
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deleteEan = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.Ean.destroy({
      where: { ean: req.params.ean },
    });

    if (numberOfDeletedRows === 0) {
      return res.status(404).json({ message: 'EAN not found' });
    }

    res.status(200).json({ message: 'EAN deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
