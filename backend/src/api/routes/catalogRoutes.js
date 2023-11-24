const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Catalog:
 *      type: object
 *      required:
 *        - catalogId
 *        - ean
 *        - supplierId
 *        - supplierPartNumber
 *        - brandId
 *        - unitPackSize
 *        - productPriceExc
 *        - productVatRate
 *        - catalogEntryLastUpdate
 *      properties:
 *        catalogId:
 *          type: integer
 *          description: The catalog entry's ID.
 *        ean:
 *          type: string
 *          description: The EAN of the product.
 *        supplierId:
 *          type: integer
 *          description: The ID of the supplier.
 *        supplierPartNumber:
 *          type: string
 *          description: The supplier's part number for the product.
 *        brandId:
 *          type: integer
 *          description: The ID of the brand.
 *        unitPackSize:
 *          type: integer
 *          description: The unit pack size of the product.
 *        productPriceExc:
 *          type: number
 *          format: double
 *          description: The price of the product excluding VAT.
 *        productVatRate:
 *          type: number
 *          format: double
 *          description: The VAT rate applicable to the product.
 *        catalogEntryLastUpdate:
 *          type: string
 *          format: date-time
 *          description: The last update time of the catalog entry.
 * tags:
 *  - name: Catalog
 *    description: The catalog managing API
 */

/**
 * @swagger
 * /catalog:
 *   get:
 *     summary: Retrieve a list of catalog entries
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of catalog entry to return
 *     responses:
 *       200:
 *         description: A list of catalog entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catalog'
 */
router.get('/', catalogController.getAllCatalogEntries);

/**
 * @swagger
 * /catalog/{catalogId}:
 *   get:
 *     summary: Get a single catalog entry by its ID
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: catalogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The catalog entry ID
 *     responses:
 *       200:
 *         description: Details of the catalog entry.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catalog'
 *       404:
 *         description: Catalog entry not found.
 */
router.get('/:catalogId', catalogController.getCatalogEntryById);

/**
 * @swagger
 * /catalog:
 *   post:
 *     summary: Create a new catalog entry
 *     tags: [Catalog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Catalog'
 *     responses:
 *       201:
 *         description: Catalog entry created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/', catalogController.createCatalogEntry);

/**
 * @swagger
 * /catalog/{catalogId}:
 *   patch:
 *     summary: Partially update an existing catalog entry
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: catalogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The catalog entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ean:
 *                 type: string
 *               supplierId:
 *                 type: integer
 *               supplierPartNumber:
 *                 type: string
 *               brandId:
 *                 type: integer
 *               unitPackSize:
 *                 type: integer
 *               productPriceExc:
 *                 type: number
 *                 format: double
 *               productVatRate:
 *                 type: number
 *                 format: double
 *               catalogEntryLastUpdate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Catalog entry updated successfully.
 *       404:
 *         description: Catalog entry not found.
 *       400:
 *         description: Invalid input.
 */
router.patch('/:catalogId', catalogController.updateCatalogEntry);

/**
 * @swagger
 * /catalog/{catalogId}:
 *   delete:
 *     summary: Delete a catalog entry
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: catalogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The catalog entry ID
 *     responses:
 *       200:
 *         description: Catalog entry deleted successfully.
 *       404:
 *         description: Catalog entry not found.
 */
router.delete('/:catalogId', catalogController.deleteCatalogEntry);

module.exports = router;
