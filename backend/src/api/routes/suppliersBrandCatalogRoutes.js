const express = require('express');
const router = express.Router();
const suppliersBrandCatalogController = require('../controllers/suppliersBrandCatalogController');

/**
 * @swagger
 * components:
 *  schemas:
 *    SupplierBrandCatalog:
 *      type: object
 *      required:
 *        - brandId
 *        - supplierId
 *      properties:
 *        supplierBrandCatalogId:
 *          type: integer
 *          description: The auto-generated ID of the supplier-brand catalog.
 *        brandId:
 *          type: integer
 *          description: The ID of the brand.
 *        supplierId:
 *          type: integer
 *          description: The ID of the supplier.
 * tags:
 *  name: SuppliersBrandCatalog
 *  description: The suppliersBrandCatalog managing API
 */

/**
 * @swagger
 * /suppliersBrandCatalog:
 *   get:
 *     summary: Retrieve a list of supplier-brand catalogs
 *     tags: [SuppliersBrandCatalog]
 *     parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 50
 *        description: Maximum number of suppliersBrandCatalog to return
 *     responses:
 *       200:
 *         description: A list of supplier-brand catalogs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupplierBrandCatalog'
 */
router.get('/', suppliersBrandCatalogController.getAllSupplierBrandCatalogs);

/**
 * @swagger
 * /suppliersBrandCatalog/{id}:
 *   get:
 *     summary: Get a supplier-brand catalog by ID
 *     tags: [SuppliersBrandCatalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The supplier-brand catalog ID
 *     responses:
 *       200:
 *         description: A single supplier-brand catalog.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierBrandCatalog'
 *       404:
 *         description: Supplier-brand catalog not found.
 */
router.get('/:id', suppliersBrandCatalogController.getSupplierBrandCatalogById);

/**
 * @swagger
 * /suppliersBrandCatalog:
 *   post:
 *     summary: Create a new supplier-brand catalog entry
 *     tags: [SuppliersBrandCatalog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupplierBrandCatalog'
 *     responses:
 *       201:
 *         description: Supplier-brand catalog created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/', suppliersBrandCatalogController.createSupplierBrandCatalog);

/**
 * @swagger
 * /suppliersBrandCatalog/{id}:
 *   patch:
 *     summary: Update a supplier-brand catalog by ID
 *     tags: [SuppliersBrandCatalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The supplier-brand catalog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandId:
 *                 type: integer
 *                 description: The ID of the brand.
 *               supplierId:
 *                 type: integer
 *                 description: The ID of the supplier.
 *     responses:
 *       200:
 *         description: Supplier-brand catalog updated successfully.
 *       404:
 *         description: Supplier-brand catalog not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:id',
  suppliersBrandCatalogController.updateSupplierBrandCatalog,
);

/**
 * @swagger
 * /suppliersBrandCatalog/{id}:
 *   delete:
 *     summary: Delete a supplier-brand catalog
 *     tags: [SuppliersBrandCatalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The supplier-brand catalog ID
 *     responses:
 *       200:
 *         description: Supplier-brand catalog deleted successfully.
 *       404:
 *         description: Supplier-brand catalog not found.
 */
router.delete(
  '/:id',
  suppliersBrandCatalogController.deleteSupplierBrandCatalog,
);

module.exports = router;
