const express = require('express');
const router = express.Router();
const eansController = require('../controllers/eansController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Ean:
 *      type: object
 *      required:
 *        - ean
 *        - productName
 *        - brandId
 *      properties:
 *        ean:
 *          type: string
 *          description: The EAN code.
 *        productName:
 *          type: string
 *          description: The name of the product.
 *        brandId:
 *          type: integer
 *          description: The ID of the brand.
 *        stockLevels:
 *          type: object
 *          additionalProperties:
 *            type: integer
 *          description: An object containing stock levels in various warehouses, with warehouse names as keys.
 * tags:
 *  name: Eans
 *  description: The Eans managing API
 */

/**
 * @swagger
 * /eans:
 *   get:
 *     summary: Retrieve the list of EANs with optional pagination and warehouse stock levels
 *     tags: [Eans]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number starting from 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of EANs to return per page
 *     responses:
 *       200:
 *         description: A list of EANs with pagination details and warehouse stock levels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ean'
 *       400:
 *         description: Invalid input for limit or page.
 */
router.get('/', eansController.getAllEans);

/**
 * @swagger
 * /eans/{ean}:
 *  get:
 *    summary: Get a single EAN by ID, including warehouse stock levels
 *    tags: [Eans]
 *    parameters:
 *      - in: path
 *        name: ean
 *        schema:
 *          type: string
 *        required: true
 *        description: The ean ID
 *    responses:
 *      200:
 *        description: Details of the EAN, including warehouse stock levels.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Ean'
 *      404:
 *        description: EAN not found.
 */

router.get('/:ean', eansController.getEanById);

/**
 * @swagger
 * /eans:
 *  post:
 *    summary: Create a new EAN
 *    tags: [Eans]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Ean'
 *    responses:
 *      201:
 *        description: EAN created successfully.
 *      400:
 *        description: Invalid input.
 */

router.post('/', eansController.createEan);

/**
 * @swagger
 * /eans/{ean}:
 *   patch:
 *     summary: Partially update an existing EAN
 *     tags: [Eans]
 *     parameters:
 *       - in: path
 *         name: ean
 *         required: true
 *         schema:
 *           type: string
 *         description: The EAN code of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: The name of the product.
 *               brandId:
 *                 type: integer
 *                 description: The ID of the brand.
 *     responses:
 *       200:
 *         description: EAN updated successfully.
 *       404:
 *         description: EAN not found.
 *       400:
 *         description: Invalid input.
 */

router.patch('/:ean', eansController.updateEan);

/**
 * @swagger
 * /eans/{ean}:
 *  delete:
 *    summary: Delete an EAN
 *    tags: [Eans]
 *    parameters:
 *      - in: path
 *        name: ean
 *        schema:
 *          type: string
 *        required: true
 *        description: The ean ID
 *    responses:
 *      200:
 *        description: EAN deleted successfully.
 *      404:
 *        description: EAN not found.
 */

router.delete('/:ean', eansController.deleteEan);

module.exports = router;
