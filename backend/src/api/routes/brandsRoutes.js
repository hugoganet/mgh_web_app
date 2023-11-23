const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brandsController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Brand:
 *      type: object
 *      required:
 *        - brandName
 *      properties:
 *        brandId:
 *          type: integer
 *          description: The brand ID.
 *        brandName:
 *          type: string
 *          description: The name of the brand.
 * tags:
 *  name: Brands
 *  description: The brands managing API
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Retrieve a list of brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: A list of brands.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 */
router.get('/', brandsController.getAllBrands);

/**
 * @swagger
 * /brands/{brandId}:
 *  get:
 *    summary: Get a single brand by ID
 *    tags: [Brands]
 *    parameters:
 *      - in: path
 *        name: brandId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The brand ID
 *    responses:
 *      200:
 *        description: Details of the brand.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Brand'
 *      404:
 *        description: Brand not found.
 */
router.get('/:brandId', brandsController.getBrandById);

/**
 * @swagger
 * /brands:
 *  post:
 *    summary: Create a new brand
 *    tags: [Brands]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Brand'
 *    responses:
 *      201:
 *        description: Brand created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', brandsController.createBrand);

/**
 * @swagger
 * /brands/{brandId}:
 *   patch:
 *     summary: Partially update an existing brand
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *                 description: The name of the brand.
 *     responses:
 *       200:
 *         description: Brand updated successfully.
 *       404:
 *         description: Brand not found.
 *       400:
 *         description: Invalid input.
 */
router.patch('/:brandId', brandsController.updateBrand);

/**
 * @swagger
 * /brands/{brandId}:
 *  delete:
 *    summary: Delete a brand
 *    tags: [Brands]
 *    parameters:
 *      - in: path
 *        name: brandId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The brand ID
 *    responses:
 *      200:
 *        description: Brand deleted successfully.
 *      404:
 *        description: Brand not found.
 */
router.delete('/:brandId', brandsController.deleteBrand);

module.exports = router;
