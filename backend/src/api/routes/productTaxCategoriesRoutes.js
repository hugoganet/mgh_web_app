const express = require('express');
const router = express.Router();
const productTaxCategoriesController = require('../controllers/productTaxCategoriesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    ProductTaxCategory:
 *      type: object
 *      required:
 *        - productTaxCategoryId
 *        - countryCode
 *        - productTaxCategoryName
 *        - productTaxCategoryDescription
 *        - vatCategoryId
 *      properties:
 *        productTaxCategoryId:
 *          type: integer
 *          description: The ID of the product tax category.
 *        countryCode:
 *          type: string
 *          description: The country code.
 *        productTaxCategoryName:
 *          type: string
 *          description: The name of the product tax category.
 *        productTaxCategoryDescription:
 *          type: string
 *          description: The description of the product tax category.
 *        vatCategoryId:
 *          type: string
 *          description: The VAT category ID.
 * tags:
 *  name: ProductTaxCategories
 *  description: The product tax categories managing API
 */

/**
 * @swagger
 * /productTaxCategories:
 *   get:
 *     summary: Retrieve a list of product tax categories
 *     tags: [ProductTaxCategories]
 *     responses:
 *       200:
 *         description: A list of product tax categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductTaxCategory'
 */
router.get('/', productTaxCategoriesController.getAllProductTaxCategories);

/**
 * @swagger
 * /productTaxCategories/{productTaxCategoryId}:
 *  get:
 *    summary: Get a single product tax category by ID
 *    tags: [ProductTaxCategories]
 *    parameters:
 *      - in: path
 *        name: productTaxCategoryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The product tax category ID
 *    responses:
 *      200:
 *        description: Details of the product tax category.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductTaxCategory'
 *      404:
 *        description: Product tax category not found.
 */
router.get(
  '/:productTaxCategoryId',
  productTaxCategoriesController.getProductTaxCategoryById,
);

/**
 * @swagger
 * /productTaxCategories:
 *  post:
 *    summary: Create a new product tax category
 *    tags: [ProductTaxCategories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProductTaxCategory'
 *    responses:
 *      201:
 *        description: Product tax category created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', productTaxCategoriesController.createProductTaxCategory);

/**
 * @swagger
 * /productTaxCategories/{productTaxCategoryId}:
 *   patch:
 *     summary: Partially update an existing product tax category
 *     tags: [ProductTaxCategories]
 *     parameters:
 *       - in: path
 *         name: productTaxCategoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product tax category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryCode:
 *                 type: string
 *                 description: The country code.
 *               productTaxCategoryName:
 *                 type: string
 *                 description: The name of the product tax category.
 *               productTaxCategoryDescription:
 *                 type: string
 *                 description: The description of the product tax category.
 *               vatCategoryId:
 *                 type: string
 *                 description: The VAT category ID.
 *     responses:
 *       200:
 *         description: Product tax category updated successfully.
 *       404:
 *         description: Product tax category not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:productTaxCategoryId',
  productTaxCategoriesController.updateProductTaxCategory,
);

/**
 * @swagger
 * /productTaxCategories/{productTaxCategoryId}:
 *  delete:
 *    summary: Delete a product tax category
 *    tags: [ProductTaxCategories]
 *    parameters:
 *      - in: path
 *        name: productTaxCategoryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The product tax category ID
 *    responses:
 *      200:
 *        description: Product tax category deleted successfully.
 *      404:
 *        description: Product tax category not found.
 */
router.delete(
  '/:productTaxCategoryId',
  productTaxCategoriesController.deleteProductTaxCategory,
);

module.exports = router;
