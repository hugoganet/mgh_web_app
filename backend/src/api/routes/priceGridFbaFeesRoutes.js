const express = require('express');
const router = express.Router();
const priceGridFbaFeesController = require('../controllers/priceGridFbaFeesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    PriceGridFbaFee:
 *      type: object
 *      required:
 *        - priceGridFbaFeeId
 *        - countryCode
 *        - fbaPackageCategoryName
 *      properties:
 *        priceGridFbaFeeId:
 *          type: integer
 *          description: The ID of the price grid FBA fee.
 *        countryCode:
 *          type: string
 *          description: The country code.
 *        fbaPackageCategoryName:
 *          type: string
 *          description: The name of the FBA package category.
 *        categoryMaxWeight:
 *          type: number
 *          format: decimal
 *          description: The maximum weight of the category.
 *        categoryMaxLength:
 *          type: number
 *          format: decimal
 *          description: The maximum length of the category.
 *        categoryMaxWidth:
 *          type: number
 *          format: decimal
 *          description: The maximum width of the category.
 *        categoryMaxHeight:
 *          type: number
 *          format: decimal
 *          description: The maximum height of the category.
 *        fbaFeeLocalAndPanEu:
 *          type: number
 *          format: decimal
 *          description: The FBA fee for local and Pan-EU.
 *        fbaFeeEfn:
 *          type: number
 *          format: decimal
 *          description: The FBA fee for EFN.
 * tags:
 *  name: PriceGridFbaFees
 *  description: The Price Grid FBA Fees managing API
 */

/**
 * @swagger
 * /priceGridFbaFees:
 *   get:
 *     summary: Retrieve a list of price grid FBA fees
 *     tags: [PriceGridFbaFees]
 *     responses:
 *       200:
 *         description: A list of price grid FBA fees.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PriceGridFbaFee'
 */
router.get('/', priceGridFbaFeesController.getAllPriceGridFbaFees);

/**
 * @swagger
 * /priceGridFbaFees/{priceGridFbaFeeId}:
 *  get:
 *    summary: Get a single price grid FBA fee by ID
 *    tags: [PriceGridFbaFees]
 *    parameters:
 *      - in: path
 *        name: priceGridFbaFeeId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The price grid FBA fee ID
 *    responses:
 *      200:
 *        description: Details of the price grid FBA fee.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PriceGridFbaFee'
 *      404:
 *        description: Price grid FBA fee not found.
 */
router.get(
  '/:priceGridFbaFeeId',
  priceGridFbaFeesController.getPriceGridFbaFeeById,
);

/**
 * @swagger
 * /priceGridFbaFees:
 *  post:
 *    summary: Create a new price grid FBA fee
 *    tags: [PriceGridFbaFees]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PriceGridFbaFee'
 *    responses:
 *      201:
 *        description: Price grid FBA fee created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', priceGridFbaFeesController.createPriceGridFbaFee);

/**
 * @swagger
 * /priceGridFbaFees/{priceGridFbaFeeId}:
 *   patch:
 *     summary: Partially update an existing price grid FBA fee
 *     tags: [PriceGridFbaFees]
 *     parameters:
 *       - in: path
 *         name: priceGridFbaFeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The price grid FBA fee ID
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
 *               fbaPackageCategoryName:
 *                 type: string
 *                 description: The name of the FBA package category.
 *               categoryMaxWeight:
 *                 type: number
 *                 format: decimal
 *                 description: The maximum weight of the category.
 *               categoryMaxLength:
 *                 type: number
 *                 format: decimal
 *                 description: The maximum length of the category.
 *               categoryMaxWidth:
 *                 type: number
 *                 format: decimal
 *                 description: The maximum width of the category.
 *               categoryMaxHeight:
 *                 type: number
 *                 format: decimal
 *                 description: The maximum height of the category.
 *               fbaFeeLocalAndPanEu:
 *                 type: number
 *                 format: decimal
 *                 description: The FBA fee for local and Pan-EU.
 *               fbaFeeEfn:
 *                 type: number
 *                 format: decimal
 *                 description: The FBA fee for EFN.
 *     responses:
 *       200:
 *         description: Price grid FBA fee updated successfully.
 *       404:
 *         description: Price grid FBA fee not found.
 *       400:
 *         description: Invalid input.
 */

router.patch(
  '/:priceGridFbaFeeId',
  priceGridFbaFeesController.updatePriceGridFbaFee,
);

/**
 * @swagger
 * /priceGridFbaFees/{priceGridFbaFeeId}:
 *  delete:
 *    summary: Delete a price grid FBA fee
 *    tags: [PriceGridFbaFees]
 *    parameters:
 *      - in: path
 *        name: priceGridFbaFeeId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The price grid FBA fee ID
 *    responses:
 *      200:
 *        description: Price grid FBA fee deleted successfully.
 *      404:
 *        description: Price grid FBA fee not found.
 */
router.delete(
  '/:priceGridFbaFeeId',
  priceGridFbaFeesController.deletePriceGridFbaFee,
);

module.exports = router;
