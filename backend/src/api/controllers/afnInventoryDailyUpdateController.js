const db = require('../models/index');
const { ValidationError } = require('sequelize');

// Common function to send error responses
const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message, stack: error.stack });
};

// GET all AfnInventoryDailyUpdates
exports.getAllAfnInventoryDailyUpdates = async (req, res) => {
  try {
    const afnInventoryDailyUpdates = await db.AfnInventoryDailyUpdate.findAll();
    res.status(200).json(afnInventoryDailyUpdates);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// GET a single AfnInventoryDailyUpdate by its ID
exports.getAfnInventoryDailyUpdateById = async (req, res) => {
  try {
    const afnInventoryDailyUpdate = await db.AfnInventoryDailyUpdate.findByPk(
      req.params.afnInventoryDailyUpdateId,
    );
    if (!afnInventoryDailyUpdate) {
      return res
        .status(404)
        .send({ error: 'Afn Inventory Daily Update not found' });
    }
    res.status(200).json(afnInventoryDailyUpdate);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// POST a new AfnInventoryDailyUpdate
exports.createAfnInventoryDailyUpdate = async (req, res) => {
  try {
    const newAfnInventoryDailyUpdate = await db.AfnInventoryDailyUpdate.create(
      req.body,
    );
    res.status(201).json(newAfnInventoryDailyUpdate);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// PATCH: Update an existing AfnInventoryDailyUpdate
exports.updateAfnInventoryDailyUpdate = async (req, res) => {
  try {
    const afnInventoryDailyUpdate = await db.AfnInventoryDailyUpdate.findByPk(
      req.params.afnInventoryDailyUpdateId,
    );
    if (!afnInventoryDailyUpdate) {
      return res
        .status(404)
        .json({ message: 'Afn Inventory Daily Update not found' });
    }

    await afnInventoryDailyUpdate.update(req.body);
    res.status(200).json({
      message: 'Afn Inventory Daily Update updated successfully',
      afnInventoryDailyUpdate,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      sendErrorResponse(res, error, 400);
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// DELETE an AfnInventoryDailyUpdate
exports.deleteAfnInventoryDailyUpdate = async (req, res) => {
  try {
    const numberOfDeletedRows = await db.AfnInventoryDailyUpdate.destroy({
      where: {
        afnInventoryDailyUpdateId: req.params.afnInventoryDailyUpdateId,
      },
    });

    if (numberOfDeletedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Afn Inventory Daily Update not found' });
    }

    res
      .status(200)
      .json({ message: 'Afn Inventory Daily Update deleted successfully' });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
