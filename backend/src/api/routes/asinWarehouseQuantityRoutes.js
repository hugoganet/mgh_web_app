const express = require('express');
const router = express.Router();
const asinWarehouseQuantityController = require('../controllers/asinWarehouseQuantityController');

/**
 * @swagger
 * components:
 *  schemas:
 *    AsinWarehouseQuantity:
 *      type: object
 *      required:
 *        - asinId
 *        - warehouseQuantity
 *      properties:
 *        asinId:
 *          type: integer
 *          description: The ASIN ID.
 *        warehouseQuantity:
 *          type: integer
 *          description: The total quantity of the ASIN across all warehouses.
 * tags:
 *  name: AsinWarehouseQuantity
 *  description: The ASIN Warehouse Quantity managing API
 */

/**
 * @swagger
 * /asinWarehouseQuantity:
 *   get:
 *     summary: Retrieve a list of ASIN Warehouse Quantities
 *     tags: [AsinWarehouseQuantity]
 *     responses:
 *       200:
 *         description: A list of ASIN Warehouse Quantities.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsinWarehouseQuantity'
 */
router.get('/', asinWarehouseQuantityController.getAllAsinWarehouseQuantities);

/**
 * @swagger
 * /asinWarehouseQuantity/{asinId}:
 *  get:
 *    summary: Get a single ASIN Warehouse Quantity by ASIN ID
 *    tags: [AsinWarehouseQuantity]
 *    parameters:
 *      - in: path
 *        name: asinId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ASIN ID
 *    responses:
 *      200:
 *        description: Details of the ASIN Warehouse Quantity.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AsinWarehouseQuantity'
 *      404:
 *        description: ASIN Warehouse Quantity not found.
 */
router.get(
  '/:asinId',
  asinWarehouseQuantityController.getAsinWarehouseQuantityById,
);

// Since this is a read-only view, POST, PATCH, and DELETE routes are not applicable

module.exports = router;
