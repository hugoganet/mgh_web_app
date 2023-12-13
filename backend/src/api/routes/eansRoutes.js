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
 *         name: offset
 *         schema:
 *           type: integer
 *         description: The number of items to skip before starting to collect the result set
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of EANs to return
 *     responses:
 *       200:
 *         description: A list of EANs with pagination details.
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
 *         description: Invalid input for limit or offset.
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
