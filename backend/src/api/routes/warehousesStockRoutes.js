const express = require('express');
const router = express.Router();
const warehousesStockController = require('../controllers/warehousesStockController');

/**
 * @swagger
 * components:
 *  schemas:
 *    WarehouseStock:
 *      type: object
 *      required:
 *        - warehouseId
 *        - ean
 *        - warehouseTotalReceivedQuantity
 *        - warehouseTotalShippedQuantity
 *        - warehouseInStockQuantity
 *      properties:
 *        warehouseStockId:
 *          type: integer
 *        warehouseId:
 *          type: integer
 *          description: The ID of the warehouse.
 *        eanSupplierOrderId:
 *          type: integer
 *          description: The EAN in supplier order ID.
 *        ean:
 *          type: string
 *          description: The EAN code of the product.
 *        warehouseTotalReceivedQuantity:
 *          type: integer
 *          description: Total quantity of product received in the warehouse.
 *        warehouseTotalShippedQuantity:
 *          type: integer
 *          description: Total quantity of product shipped from the warehouse.
 *        warehouseInStockQuantity:
 *          type: integer
 *          description: Quantity of product currently in stock in the warehouse.
 * tags:
 *  name: WarehouseStock
 *  description: The Warehouse Stock managing API
 */

/**
 * @swagger
 * /warehousesStock:
 *   get:
 *     summary: Retrieve a list of warehouse stocks
 *     tags: [WarehouseStock]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of warehouse stock to return
 *     responses:
 *       200:
 *         description: A list of warehouse stocks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WarehouseStock'
 */
router.get('/', warehousesStockController.getAllWarehouseStocks);

/**
 * @swagger
 * /warehousesStock/{warehouseStockId}:
 *   get:
 *     summary: Get a single warehouse stock by ID
 *     tags: [WarehouseStock]
 *     parameters:
 *       - in: path
 *         name: warehouseStockId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The warehouse stock ID
 *     responses:
 *       200:
 *         description: Details of the warehouse stock.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseStock'
 *       404:
 *         description: Warehouse stock not found.
 */
router.get(
  '/:warehouseStockId',
  warehousesStockController.getWarehouseStockById,
);

/**
 * @swagger
 * /warehousesStock:
 *   post:
 *     summary: Create a new warehouse stock
 *     tags: [WarehouseStock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WarehouseStock'
 *     responses:
 *       201:
 *         description: Warehouse stock created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/', warehousesStockController.createWarehouseStock);

/**
 * @swagger
 * /warehousesStock/{warehouseStockId}:
 *   patch:
 *     summary: Partially update an existing warehouse stock
 *     tags: [WarehouseStock]
 *     parameters:
 *       - in: path
 *         name: warehouseStockId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the warehouse stock to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               warehouseId:
 *                 type: integer
 *                 description: The ID of the warehouse.
 *               eanSupplierOrderId:
 *                 type: integer
 *                 description: The EAN in supplier order ID.
 *               ean:
 *                 type: string
 *                 description: The EAN code of the product.
 *               warehouseTotalReceivedQuantity:
 *                 type: integer
 *                 description: Total quantity of product received in the warehouse.
 *               warehouseTotalShippedQuantity:
 *                 type: integer
 *                 description: Total quantity of product shipped from the warehouse.
 *               warehouseInStockQuantity:
 *                 type: integer
 *                 description: Quantity of product currently in stock in the warehouse.
 *     responses:
 *       200:
 *         description: Warehouse stock updated successfully.
 *       404:
 *         description: Warehouse stock not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:warehouseStockId',
  warehousesStockController.updateWarehouseStock,
);

/**
 * @swagger
 * /warehousesStock/{warehouseStockId}:
 *   delete:
 *     summary: Delete a warehouse stock
 *     tags: [WarehouseStock]
 *     parameters:
 *       - in: path
 *         name: warehouseStockId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The warehouse stock ID
 *     responses:
 *       200:
 *         description: Warehouse stock deleted successfully.
 *       404:
 *         description: Warehouse stock not found.
 */
router.delete(
  '/:warehouseStockId',
  warehousesStockController.deleteWarehouseStock,
);

module.exports = router;
