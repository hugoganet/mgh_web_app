const express = require('express');
const router = express.Router();
const productAndAmzReferralFeesCategoriesMappingController = require('../controllers/productAndAmzReferralFeeCategoriesMappingController');

/**
 * @swagger
 * components:
 *  schemas:
 *    ProductAndAmzReferralFeeCategory:
 *      type: object
 *      required:
 *        - productCategoryId
 *        - referralFeeCategoryId
 *      properties:
 *        productAndAmzReferralFeeCategoryId:
 *          type: integer
 *          description: The ID of the product and Amazon referral fee category mapping.
 *        productCategoryId:
 *          type: integer
 *          description: The product category ID.
 *        referralFeeCategoryId:
 *          type: integer
 *          description: The Amazon referral fee category ID.
 * tags:
 *  name: ProductAndAmzReferralFeeCategories
 *  description: The API for managing the mapping between product categories and Amazon referral fee categories.
 */

/**
 * @swagger
 * /productAndAmzReferralFeeCategories:
 *   get:
 *     summary: Retrieve a list of product and Amazon referral fee category mappings
 *     tags: [ProductAndAmzReferralFeeCategories]
 *     responses:
 *       200:
 *         description: A list of product and Amazon referral fee category mappings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductAndAmzReferralFeeCategory'
 */
router.get(
  '/',
  productAndAmzReferralFeesCategoriesMappingController.getAllMappings,
);

/**
 * @swagger
 * /productAndAmzReferralFeeCategories/{productAndAmzReferralFeeCategoryId}:
 *  get:
 *    summary: Get a single mapping by ID
 *    tags: [ProductAndAmzReferralFeeCategories]
 *    parameters:
 *      - in: path
 *        name: productAndAmzReferralFeeCategoryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The mapping ID.
 *    responses:
 *      200:
 *        description: Details of the mapping.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductAndAmzReferralFeeCategory'
 *      404:
 *        description: Mapping not found.
 */
router.get(
  '/:mappingId',
  productAndAmzReferralFeesCategoriesMappingController.getMappingById,
);

/**
 * @swagger
 * /productAndAmzReferralFeeCategories:
 *  post:
 *    summary: Create a new mapping
 *    tags: [ProductAndAmzReferralFeeCategories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProductAndAmzReferralFeeCategory'
 *    responses:
 *      201:
 *        description: Mapping created successfully.
 */
router.post(
  '/',
  productAndAmzReferralFeesCategoriesMappingController.createMapping,
);

/**
 * @swagger
 * /productAndAmzReferralFeeCategories/{mappingId}:
 *   patch:
 *     summary: Partially update an existing mapping
 *     tags: [ProductAndAmzReferralFeeCategories]
 *     parameters:
 *       - in: path
 *         name: mappingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The mapping ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productCategoryId:
 *                 type: integer
 *                 description: Updated product category ID.
 *               referralFeeCategoryId:
 *                 type: integer
 *                 description: Updated Amazon referral fee category ID.
 *     responses:
 *       200:
 *         description: Mapping updated successfully.
 *       404:
 *         description: Mapping not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:mappingId',
  productAndAmzReferralFeesCategoriesMappingController.updateMapping,
);

/**
 * @swagger
 * /productAndAmzReferralFeeCategories/{mappingId}:
 *  delete:
 *    summary: Delete a mapping
 *    tags: [ProductAndAmzReferralFeeCategories]
 *    parameters:
 *      - in: path
 *        name: mappingId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The mapping ID.
 *    responses:
 *      200:
 *        description: Mapping deleted successfully.
 *      404:
 *        description: Mapping not found.
 */
router.delete(
  '/:mappingId',
  productAndAmzReferralFeesCategoriesMappingController.deleteMapping,
);

module.exports = router;
