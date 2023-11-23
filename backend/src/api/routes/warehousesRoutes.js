const express = require('express');
const router = express.Router();
const warehousesController = require('../controllers/warehousesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Warehouse:
 *      type: object
 *      required:
 *        - warehouseName
 *        - warehouseAddress
 *        - warehousePostcode
 *        - warehouseCity
 *        - warehouseCountry
 *        - warehouseContactName
 *        - warehouseContactNumber
 *        - warehouseContactEmail
 *      properties:
 *        warehouseId:
 *          type: integer
 *          description: The primary key of the warehouse.
 *        warehouseName:
 *          type: string
 *          description: The name of the warehouse.
 *        warehouseAddress:
 *          type: string
 *          description: The address of the warehouse.
 *        warehousePostcode:
 *          type: string
 *          description: The postcode of the warehouse.
 *        warehouseCity:
 *          type: string
 *          description: The city where the warehouse is located.
 *        warehouseCountry:
 *          type: string
 *          description: The country where the warehouse is located.
 *        warehouseNote:
 *          type: string
 *          description: Any additional notes about the warehouse.
 *        warehouseContactName:
 *          type: string
 *          description: The contact person's name for the warehouse.
 *        warehouseContactNumber:
 *          type: string
 *          description: The contact phone number for the warehouse.
 *        warehouseContactEmail:
 *          type: string
 *          description: The contact email for the warehouse.
 * tags:
 *  name: Warehouses
 *  description: The Warehouses managing API
 */

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Retrieve a list of warehouses
 *     tags: [Warehouses]
 *     responses:
 *       200:
 *         description: A list of warehouses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warehouse'
 */
router.get('/', warehousesController.getAllWarehouses);

/**
 * @swagger
 * /warehouses/{warehouseId}:
 *  get:
 *    summary: Get a single warehouse by ID
 *    tags: [Warehouses]
 *    parameters:
 *      - in: path
 *        name: warehouseId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The Warehouse ID
 *    responses:
 *      200:
 *        description: Details of the warehouse.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Warehouse'
 *      404:
 *        description: Warehouse not found.
 */
router.get('/:warehouseId', warehousesController.getWarehouseById);

/**
 * @swagger
 * /warehouses:
 *  post:
 *    summary: Create a new warehouse
 *    tags: [Warehouses]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Warehouse'
 *    responses:
 *      201:
 *        description: Warehouse created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', warehousesController.createWarehouse);

/**
 * @swagger
 * /warehouses/{warehouseId}:
 *   patch:
 *     summary: Partially update an existing warehouse
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the warehouse to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               warehouseName:
 *                 type: string
 *                 description: The name of the warehouse.
 *               warehouseAddress:
 *                 type: string
 *                 description: The address of the warehouse.
 *               warehousePostcode:
 *                 type: string
 *                 description: The postcode of the warehouse.
 *               warehouseCity:
 *                 type: string
 *                 description: The city where the warehouse is located.
 *               warehouseCountry:
 *                 type: string
 *                 description: The country where the warehouse is located.
 *               warehouseNote:
 *                 type: string
 *                 description: Any additional notes about the warehouse.
 *               warehouseContactName:
 *                 type: string
 *                 description: The contact person's name for the warehouse.
 *               warehouseContactNumber:
 *                 type: string
 *                 description: The contact phone number for the warehouse.
 *               warehouseContactEmail:
 *                 type: string
 *                 description: The contact email for the warehouse.
 *     responses:
 *       200:
 *         description: Warehouse updated successfully.
 *       404:
 *         description: Warehouse not found.
 *       400:
 *         description: Invalid input.
 */
router.patch('/:warehouseId', warehousesController.updateWarehouse);

/**
 * @swagger
 * /warehouses/{warehouseId}:
 *  delete:
 *    summary: Delete a warehouse
 *    tags: [Warehouses]
 *    parameters:
 *      - in: path
 *        name: warehouseId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The Warehouse ID
 *    responses:
 *      200:
 *        description: Warehouse deleted successfully.
 *      404:
 *        description: Warehouse not found.
 */
router.delete('/:warehouseId', warehousesController.deleteWarehouse);

module.exports = router;
