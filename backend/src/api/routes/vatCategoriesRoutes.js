const express = require('express');
const router = express.Router();
const vatCategoriesController = require('../controllers/vatCategoriesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    VatCategory:
 *      type: object
 *      required:
 *        - vatCategoryId
 *        - vatCategoryDefinition
 *      properties:
 *        vatCategoryId:
 *          type: string
 *          description: The VAT category ID.
 *        vatCategoryDefinition:
 *          type: string
 *          description: Definition of the VAT category.
 * tags:
 *  name: VatCategories
 *  description: The VAT categories managing API
 */

/**
 * @swagger
 * /vatCategories:
 *   get:
 *     summary: Retrieve a list of VAT categories
 *     tags: [VatCategories]
 *     responses:
 *       200:
 *         description: A list of VAT categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VatCategory'
 */

router.get('/', vatCategoriesController.getAllVatCategories);

/**
 * @swagger
 * /vatCategories/{vatCategoryId}:
 *  get:
 *    summary: Get a single VAT category by ID
 *    tags: [VatCategories]
 *    parameters:
 *      - in: path
 *        name: vatCategoryId
 *        schema:
 *          type: string
 *        required: true
 *        description: The VAT category ID
 *    responses:
 *      200:
 *        description: Details of the VAT category.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/VatCategory'
 *      404:
 *        description: VAT category not found.
 */

router.get('/:vatCategoryId', vatCategoriesController.getVatCategoryById);

/**
 * @swagger
 * /vatCategories:
 *  post:
 *    summary: Create a new VAT category
 *    tags: [VatCategories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/VatCategory'
 *    responses:
 *      201:
 *        description: VAT category created successfully.
 *      400:
 *        description: Invalid input.
 */

router.post('/', vatCategoriesController.createVatCategory);

/**
 * @swagger
 * /vatCategories/{vatCategoryId}:
 *   patch:
 *     summary: Partially update an existing VAT category
 *     tags: [VatCategories]
 *     parameters:
 *       - in: path
 *         name: vatCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the VAT category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vatCategoryDefinition:
 *                 type: string
 *                 description: Definition of the VAT category.
 *     responses:
 *       200:
 *         description: VAT category updated successfully.
 *       404:
 *         description: VAT category not found.
 *       400:
 *         description: Invalid input.
 */

router.patch('/:vatCategoryId', vatCategoriesController.updateVatCategory);

/**
 * @swagger
 * /vatCategories/{vatCategoryId}:
 *  delete:
 *    summary: Delete a VAT category
 *    tags: [VatCategories]
 *    parameters:
 *      - in: path
 *        name: vatCategoryId
 *        schema:
 *          type: string
 *        required: true
 *        description: The VAT category ID
 *    responses:
 *      200:
 *        description: VAT category deleted successfully.
 *      404:
 *        description: VAT category not found.
 */

router.delete('/:vatCategoryId', vatCategoriesController.deleteVatCategory);

module.exports = router;
