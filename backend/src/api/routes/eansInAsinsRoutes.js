const express = require('express');
const router = express.Router();
const eansInAsinsController = require('../controllers/eansInAsinsController');

/**
 * @swagger
 * components:
 *  schemas:
 *    EanInAsin:
 *      type: object
 *      required:
 *        - asinId
 *        - ean
 *      properties:
 *        eanInAsinId:
 *          type: integer
 *          description: The auto-generated ID of the EAN-ASIN association.
 *        asinId:
 *          type: integer
 *          description: The ID of the ASIN.
 *        ean:
 *          type: string
 *          description: The EAN code.
 *        eanInAsinQuantity:
 *          type: integer
 *          description: The quantity of the EAN-ASIN association.
 * tags:
 *  name: EansInAsins
 *  description: The EansInAsins managing API
 */

/**
 * @swagger
 * /eansInAsins:
 *   get:
 *     summary: Retrieve a list of EAN-ASIN associations
 *     tags: [EansInAsins]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of Eans to return
 *     responses:
 *       200:
 *         description: A list of EAN-ASIN associations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EanInAsin'
 */
router.get('/', eansInAsinsController.getAllEanInAsins);

/**
 * @swagger
 * /eansInAsins/{id}:
 *   get:
 *     summary: Get an EAN-ASIN association by ID
 *     tags: [EansInAsins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The EAN-ASIN association ID
 *     responses:
 *       200:
 *         description: A single EAN-ASIN association.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EanInAsin'
 *       404:
 *         description: EAN-ASIN association not found.
 */
router.get('/:id', eansInAsinsController.getEanInAsinById);

/**
 * @swagger
 * /eansInAsins:
 *   post:
 *     summary: Create a new EAN-ASIN association
 *     tags: [EansInAsins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EanInAsin'
 *     responses:
 *       201:
 *         description: EAN-ASIN association created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/', eansInAsinsController.createEanInAsin);

/**
 * @swagger
 * /eansInAsins/{id}:
 *   patch:
 *     summary: Update an EAN-ASIN association by ID
 *     tags: [EansInAsins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The EAN-ASIN association ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asinId:
 *                 type: integer
 *                 description: The ID of the ASIN.
 *               ean:
 *                 type: string
 *                 description: The EAN code.
 *               eanInAsinQuantity:
 *                 type: integer
 *                 description: The quantity of the EAN-ASIN association.
 *     responses:
 *       200:
 *         description: EAN-ASIN association updated successfully.
 *       404:
 *         description: EAN-ASIN association not found.
 *       400:
 *         description: Invalid input.
 */
router.patch('/:id', eansInAsinsController.updateEanInAsin);

/**
 * @swagger
 * /eansInAsins/{id}:
 *   delete:
 *     summary: Delete an EAN-ASIN association
 *     tags: [EansInAsins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The EAN-ASIN association ID
 *     responses:
 *       200:
 *         description: EAN-ASIN association deleted successfully.
 *       404:
 *         description: EAN-ASIN association not found.
 */
router.delete('/:id', eansInAsinsController.deleteEanInAsin);

module.exports = router;
