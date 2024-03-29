const db = require('../../database/models/index');
const { ValidationError } = require('sequelize');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

exports.getAllEansInSuppliersOrders = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  if (isNaN(limit)) {
    return sendErrorResponse(res, new Error("Invalid 'limit' value"), 400);
  }

  try {
    const eansInSuppliersOrders = await db.EanInSupplierOrder.findAll({
      limit,
    });
    res.status(200).json(eansInSuppliersOrders);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getEanInSupplierOrderById = async (req, res) => {
  try {
    const eanInSupplierOrder = await db.EanInSupplierOrder.findByPk(
      req.params.eanInSupplierOrderId,
    );
    if (!eanInSupplierOrder) {
      return res.status(404).send({ error: 'EAN in Supplier Order not found' });
    }
    res.status(200).json(eanInSupplierOrder);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createEanInSupplierOrder = async (req, res) => {
  try {
    const newEanInSupplierOrderData = {
      ...req.body,
      eanInSupplierOrderId: undefined, // Exclude 'eanInSupplierOrderId' as it is auto-incremented
    };

    const newEanInSupplierOrder = await db.EanInSupplierOrder.create(
      newEanInSupplierOrderData,
    );
    res.status(201).json(newEanInSupplierOrder);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.updateEanInSupplierOrder = async (req, res) => {
  const eanInSupplierOrderToUpdate = req.params.eanInSupplierOrderId;
  const updateData = req.body;

  try {
    const eanInSupplierOrder = await db.EanInSupplierOrder.findByPk(
      eanInSupplierOrderToUpdate,
    );
    if (!eanInSupplierOrder) {
      return res
        .status(404)
        .json({ message: 'EAN in Supplier Order not found' });
    }

    Object.assign(eanInSupplierOrder, updateData);
    await eanInSupplierOrder.save();
    res.status(200).json({
      message: 'EAN in Supplier Order updated successfully',
      eanInSupplierOrder,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

exports.deleteEanInSupplierOrder = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.EanInSupplierOrder.destroy({
      where: { eanInSupplierOrderId: req.params.eanInSupplierOrderId },
    });

    if (numberOfDeletedRows === 0) {
      return res
        .status(404)
        .json({ message: 'EAN in Supplier Order not found' });
    }

    res
      .status(200)
      .json({ message: 'EAN in Supplier Order deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = exports;
