const express = require('express');
// eslint-disable-next-line new-cap
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
 */

/**
 * @swagger
 * tags:
 *  name: Eans
 *  description: The Eans managing API
 */

/**
 * @swagger
 * /eans:
 *   get:
 *     summary: Retrieve the list of EANs with optional pagination
 *     tags: [Eans]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of EANs to return
 *     responses:
 *       200:
 *         description: A list of EANs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ean'
 *       400:
 *         description: Invalid input for limit.
 */

router.get('/', eansController.getAllEans);

/**
 * @swagger
 * /eans/{ean}:
 *  get:
 *    summary: Get a single EAN by ID
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
 *        description: Details of the EAN.
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
 *  put:
 *    summary: Update an existing EAN
 *    tags: [Eans]
 *    parameters:
 *      - in: path
 *        name: ean
 *        schema:
 *          type: string
 *        required: true
 *        description: The ean ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Ean'
 *    responses:
 *      200:
 *        description: EAN updated successfully.
 *      400:
 *        description: Invalid input.
 *      404:
 *        description: EAN not found.
 */

router.put('/:ean', eansController.updateEan);

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
