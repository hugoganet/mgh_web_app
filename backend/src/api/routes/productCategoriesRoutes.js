const express = require('express');
const router = express.Router();
const productCategoriesController = require('../controllers/productCategoriesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    ProductCategory:
 *      type: object
 *      required:
 *        - productCategoryNameEn
 *        - productCategoryNameFr
 *        - productCategoryNameDe
 *        - productCategoryNameEs
 *        - productCategoryNameIt
 *      properties:
 *        productCategoryId:
 *          type: integer
 *          description: The product category ID.
 *        productCategoryNameEn:
 *          type: string
 *          description: The English name of the product category.
 *        productCategoryNameFr:
 *          type: string
 *          description: The French name of the product category.
 *        productCategoryNameDe:
 *          type: string
 *          description: The German name of the product category.
 *        productCategoryNameEs:
 *          type: string
 *          description: The Spanish name of the product category.
 *        productCategoryNameIt:
 *          type: string
 *          description: The Italian name of the product category.
 * tags:
 *  name: ProductCategories
 *  description: The product categories managing API
 */

/**
 * @swagger
 * /productCategories:
 *   get:
 *     summary: Retrieve a list of product categories
 *     tags: [ProductCategories]
 *     responses:
 *       200:
 *         description: A list of product categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductCategory'
 */
router.get('/', productCategoriesController.getAllProductCategories);

/**
 * @swagger
 * /productCategories/{productCategoryId}:
 *  get:
 *    summary: Get a single product category by ID
 *    tags: [ProductCategories]
 *    parameters:
 *      - in: path
 *        name: productCategoryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The product category ID
 *    responses:
 *      200:
 *        description: Details of the product category.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductCategory'
 *      404:
 *        description: Product category not found.
 */
router.get(
  '/:productCategoryId',
  productCategoriesController.getProductCategoryById,
);

/**
 * @swagger
 * /productCategories:
 *  post:
 *    summary: Create a new product category
 *    tags: [ProductCategories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProductCategory'
 *    responses:
 *      201:
 *        description: Product category created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', productCategoriesController.createProductCategory);

/**
 * @swagger
 * /productCategories/{productCategoryId}:
 *   patch:
 *     summary: Partially update an existing product category
 *     tags: [ProductCategories]
 *     parameters:
 *       - in: path
 *         name: productCategoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productCategoryNameEn:
 *                 type: string
 *                 description: The English name of the product category.
 *               productCategoryNameFr:
 *                 type: string
 *                 description: The French name of the product category.
 *               productCategoryNameDe:
 *                 type: string
 *                 description: The German name of the product category.
 *               productCategoryNameEs:
 *                 type: string
 *                 description: The Spanish name of the product category.
 *               productCategoryNameIt:
 *                 type: string
 *                 description: The Italian name of the product category.
 *     responses:
 *       200:
 *         description: Product category updated successfully.
 *       404:
 *         description: Product category not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:productCategoryId',
  productCategoriesController.updateProductCategory,
);

/**
 * @swagger
 * /productCategories/{productCategoryId}:
 *  delete:
 *    summary: Delete a product category
 *    tags: [ProductCategories]
 *    parameters:
 *      - in: path
 *        name: productCategoryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The product category ID
 *    responses:
 *      200:
 *        description: Product category deleted successfully.
 *      404:
 *        description: Product category not found.
 */
router.delete(
  '/:productCategoryId',
  productCategoriesController.deleteProductCategory,
);

module.exports = router;
