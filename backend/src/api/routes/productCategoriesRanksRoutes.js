const express = require('express');
const router = express.Router();
const productCategoriesRanksController = require('../controllers/productCategoriesRanksController');

/**
 * @swagger
 * components:
 *  schemas:
 *    ProductCategoryRank:
 *      type: object
 *      required:
 *        - countryCode
 *        - productCategoryId
 *        - rankingThreshold
 *        - rankingThresholdPercentage
 *      properties:
 *        productCategoryRankId:
 *          type: integer
 *          description: The ID of the product category rank.
 *        countryCode:
 *          type: string
 *          description: The country code.
 *        productCategoryId:
 *          type: integer
 *          description: The ID of the product category.
 *        rankingThreshold:
 *          type: integer
 *          description: The ranking threshold.
 *        rankingThresholdPercentage:
 *          type: number
 *          format: double
 *          description: The ranking threshold percentage.
 * tags:
 *  name: ProductCategoriesRanks
 *  description: Managing product categories ranks API
 */

/**
 * @swagger
 * /productCategoriesRanks:
 *   get:
 *     summary: Retrieve a list of product category ranks
 *     tags: [ProductCategoriesRanks]
 *     responses:
 *       200:
 *         description: A list of product category ranks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductCategoryRank'
 */
router.get('/', productCategoriesRanksController.getAllProductCategoryRanks);

/**
 * @swagger
 * /productCategoriesRanks/{productCategoryRankId}:
 *  get:
 *    summary: Get a single product category rank by ID
 *    tags: [ProductCategoriesRanks]
 *    parameters:
 *      - in: path
 *        name: productCategoryRankId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The product category rank ID
 *    responses:
 *      200:
 *        description: Details of the product category rank.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductCategoryRank'
 *      404:
 *        description: Product category rank not found.
 */
router.get(
  '/:productCategoryRankId',
  productCategoriesRanksController.getProductCategoryRankById,
);

/**
 * @swagger
 * /productCategoriesRanks:
 *  post:
 *    summary: Create a new product category rank
 *    tags: [ProductCategoriesRanks]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProductCategoryRank'
 *    responses:
 *      201:
 *        description: Product category rank created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', productCategoriesRanksController.createProductCategoryRank);

/**
 * @swagger
 * /productCategoriesRanks/{productCategoryRankId}:
 *   patch:
 *     summary: Partially update an existing product category rank
 *     tags: [ProductCategoriesRanks]
 *     parameters:
 *       - in: path
 *         name: productCategoryRankId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product category rank ID
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
 *               productCategoryId:
 *                 type: integer
 *                 description: The ID of the product category.
 *               rankingThreshold:
 *                 type: integer
 *                 description: The ranking threshold.
 *               rankingThresholdPercentage:
 *                 type: number
 *                 format: double
 *                 description: The ranking threshold percentage.
 *     responses:
 *       200:
 *         description: Product category rank updated successfully.
 *       404:
 *         description: Product category rank not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:productCategoryRankId',
  productCategoriesRanksController.updateProductCategoryRank,
);

/**
 * @swagger
 * /productCategoriesRanks/{productCategoryRankId}:
 *  delete:
 *    summary: Delete a product category rank
 *    tags: [ProductCategoriesRanks]
 *    parameters:
 *      - in: path
 *        name: productCategoryRankId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The product category rank ID
 *    responses:
 *      200:
 *        description: Product category rank deleted successfully.
 *      404:
 *        description: Product category rank not found.
 */
router.delete(
  '/:productCategoryRankId',
  productCategoriesRanksController.deleteProductCategoryRank,
);

module.exports = router;
