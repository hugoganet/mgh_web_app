const express = require('express');
const router = express.Router();
const eansController = require('../controllers/eansController');

/**
 * @swagger
 * components:
 *  schemas:
 *   Ean:
 *    type: object
 *    required:
 *     - ean
 *     - productName
 *     - brandId
 *    properties:
 *     ean:
 *      type: string
 *      description: The EAN code.
 *     productName:
 *      type: string
 *      description: The name of the product.
 *     brandId:
 *      type: integer
 *      description: The ID of the brand.
 */
/**
 * @swagger
 * tags:
 *  name: Eans
 *  description: The Eans managing API
 * /eans:
 *   get:
 *     summary: Retrieve the list of EANs
 *     tags: [Eans]
 *     responses:
 *       200:
 *         description: The list of EANs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/Ean'
 */

router.get('/eans', eansController.getAllEans);

// // GET a single EAN by ID
// router.get('/:eanId', eansController.getEanById);

// // POST a new EAN
// router.post('/ean', eansController.createEan);

// // PUT (update) an existing EAN
// router.put('/:eanId', eansController.updateEan);

// // DELETE an EAN
// router.delete('/:eanId', eansController.deleteEan);

module.exports = router;
