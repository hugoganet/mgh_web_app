const express = require('express');
const router = express.Router();
const asinsController = require('../controllers/asinsController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Asin:
 *      type: object
 *      required:
 *        - asin
 *        - countryCode
 *        - productCategoryId
 *        - productCategoryRankId
 *        - productTaxCategoryId
 *        - asinName
 *        - asinPotentialWarehousesQuantity
 *        - asinNumberOfActiveSku
 *        - asinAverageUnitSoldPerDay
 *        - isBatteryRequired
 *        - isHazmat
 *      properties:
 *        asinId:
 *          type: integer
 *        asin:
 *          type: string
 *          description: The ASIN code.
 *        countryCode:
 *          type: string
 *          description: Country code associated with the ASIN.
 *        productCategoryId:
 *          type: integer
 *          description: ID of the product category.
 *        productCategoryRankId:
 *          type: integer
 *          description: Rank ID of the product category.
 *        productTaxCategoryId:
 *          type: integer
 *          description: Tax category ID of the product.
 *        asinPreparation:
 *          type: string
 *          description: Preparation details for the ASIN.
 *        urlAmazon:
 *          type: string
 *          description: Amazon URL of the product.
 *        urlImage:
 *          type: string
 *          description: Image URL of the product.
 *        asinName:
 *          type: string
 *          description: Name of the product associated with the ASIN.
 *        asinPotentialWarehousesQuantity:
 *          type: integer
 *          description: Potential quantity of the product in warehouses.
 *        asinNumberOfActiveSku:
 *          type: integer
 *          description: Number of active SKUs.
 *        asinAverageUnitSoldPerDay:
 *          type: number
 *          format: double
 *          description: Average units sold per day.
 *        isBatteryRequired:
 *          type: boolean
 *          description: Indicates if a battery is required.
 *        isHazmat:
 *          type: boolean
 *          description: Indicates if the product is hazardous material.
 * tags:
 *  name: Asins
 *  description: The ASINs managing API
 */

/**
 * @swagger
 * /asins:
 *   get:
 *     summary: Retrieve a list of ASINs with optional limit
 *     tags: [Asins]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of ASINs to return
 *     responses:
 *       200:
 *         description: A list of ASINs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asin'
 *       400:
 *         description: Invalid input for limit.
 */
router.get('/', asinsController.getAllAsins);

/**
 * @swagger
 * /asins/{asinId}:
 *  get:
 *    summary: Get a single ASIN by ID
 *    tags: [Asins]
 *    parameters:
 *      - in: path
 *        name: asinId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ASIN ID
 *    responses:
 *      200:
 *        description: Details of the ASIN.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Asin'
 *      404:
 *        description: ASIN not found.
 */

router.get('/:asinId', asinsController.getAsinById);

/**
 * @swagger
 * /asins:
 *  post:
 *    summary: Create a new ASIN
 *    tags: [Asins]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Asin'
 *    responses:
 *      201:
 *        description: ASIN created successfully.
 *      400:
 *        description: Invalid input.
 */

router.post('/', asinsController.createAsin);

/**
 * @swagger
 * /asins/{asinId}:
 *   patch:
 *     summary: Partially update an existing ASIN
 *     tags: [Asins]
 *     parameters:
 *       - in: path
 *         name: asinId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the ASIN to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryCode:
 *                 type: string
 *                 description: Country code associated with the ASIN.
 *               productCategoryId:
 *                 type: integer
 *                 description: ID of the product category.
 *               productCategoryRankId:
 *                 type: integer
 *                 description: Rank ID of the product category.
 *               productTaxCategoryId:
 *                 type: integer
 *                 description: Tax category ID of the product.
 *               asinPreparation:
 *                 type: string
 *                 description: Preparation details for the ASIN.
 *               urlAmazon:
 *                 type: string
 *                 description: Amazon URL of the product.
 *               urlImage:
 *                 type: string
 *                 description: Image URL of the product.
 *               asinName:
 *                 type: string
 *                 description: Name of the product associated with the ASIN.
 *               asinPotentialWarehousesQuantity:
 *                 type: integer
 *                 description: Potential quantity of the product in warehouses.
 *               asinNumberOfActiveSku:
 *                 type: integer
 *                 description: Number of active SKUs.
 *               asinAverageUnitSoldPerDay:
 *                 type: number
 *                 format: double
 *                 description: Average units sold per day.
 *               isBatteryRequired:
 *                 type: boolean
 *                 description: Indicates if a battery is required.
 *               isHazmat:
 *                 type: boolean
 *                 description: Indicates if the product is hazardous material.
 *     responses:
 *       200:
 *         description: ASIN updated successfully.
 *       404:
 *         description: ASIN not found.
 *       400:
 *         description: Invalid input.
 */

router.patch('/:asinId', asinsController.updateAsin);

/**
 * @swagger
 * /asins/{asinId}:
 *  delete:
 *    summary: Delete an ASIN
 *    tags: [Asins]
 *    parameters:
 *      - in: path
 *        name: asinId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ASIN ID
 *    responses:
 *      200:
 *        description: ASIN deleted successfully.
 *      404:
 *        description: ASIN not found.
 */

router.delete('/:asinId', asinsController.deleteAsin);

module.exports = router;
