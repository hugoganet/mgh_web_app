const express = require('express');
const router = express.Router();
const eansController = require('../controllers/eansController');

/**
 * @swagger
 * /eans:
 *   get:
 *     summary: Retrieve a list of EANs
 *     responses:
 *       200:
 *         description: A list of EANs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ean:
 *                     type: string
 *                     description: The EAN code.
 *                   productName:
 *                     type: string
 *                     description: The name of the product.
 */
router.get('/eans', eansController.getAllEans);

// GET a single EAN by ID
router.get('/:eanId', eansController.getEanById);

// POST a new EAN
router.post('/ean', eansController.createEan);

// PUT (update) an existing EAN
router.put('/:eanId', eansController.updateEan);

// DELETE an EAN
router.delete('/:eanId', eansController.deleteEan);

module.exports = router;
