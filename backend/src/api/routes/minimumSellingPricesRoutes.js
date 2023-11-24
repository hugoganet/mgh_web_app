const express = require('express');
const router = express.Router();
const minimumSellingPricesController = require('../controllers/minimumSellingPricesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    MinimumSellingPrice:
 *      type: object
 *      required:
 *        - minimumSellingPriceId
 *        - skuId
 *        - pricingRuleId
 *        - enrolledInPanEu
 *        - eligibleForPanEu
 *        - referralFeeCategoryId
 *        - minimumMarginWanted
 *        - minimumSellingPriceLocalAndPanEu
 *        - minimumSellingPriceEfn
 *        - maximumSellingPriceLocalAndPanEu
 *        - maximumSellingPriceEfn
 *      properties:
 *        minimumSellingPriceId:
 *          type: integer
 *          description: The unique identifier for the minimum selling price.
 *        skuId:
 *          type: integer
 *          description: The identifier for the SKU.
 *        pricingRuleId:
 *          type: integer
 *          description: The identifier for the pricing rule.
 *        enrolledInPanEu:
 *          type: boolean
 *          description: Indicates if the product is enrolled in Pan EU.
 *        eligibleForPanEu:
 *          type: boolean
 *          description: Indicates if the product is eligible for Pan EU.
 *        referralFeeCategoryId:
 *          type: integer
 *          description: The identifier for the referral fee category.
 *        minimumMarginWanted:
 *          type: number
 *          format: float
 *          description: The minimum margin wanted for the product.
 *        minimumSellingPriceLocalAndPanEu:
 *          type: number
 *          format: float
 *          description: The minimum selling price for local and Pan EU.
 *        minimumSellingPriceEfn:
 *          type: number
 *          format: float
 *          description: The minimum selling price for EFN.
 *        maximumSellingPriceLocalAndPanEu:
 *          type: number
 *          format: float
 *          description: The maximum selling price for local and Pan EU.
 *        maximumSellingPriceEfn:
 *          type: number
 *          format: float
 *          description: The maximum selling price for EFN.
 * tags:
 *  name: Minimum Selling Prices
 *  description: The minimum selling prices API
 */

/**
 * @swagger
 * /minimumSellingPrices:
 *   get:
 *     summary: Retrieve a list of all minimum selling prices
 *     tags: [Minimum Selling Prices]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of SKUs to return
 *     responses:
 *       200:
 *         description: A list of minimum selling prices.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MinimumSellingPrice'
 */
router.get('/', minimumSellingPricesController.getAllMinimumSellingPrices);

/**
 * @swagger
 * /minimumSellingPrices/{minimumSellingPriceId}:
 *   get:
 *     summary: Retrieve a single minimum selling price by ID
 *     tags: [Minimum Selling Prices]
 *     parameters:
 *       - in: path
 *         name: minimumSellingPriceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The minimum selling price ID
 *     responses:
 *       200:
 *         description: A single minimum selling price.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MinimumSellingPrice'
 *       404:
 *         description: Minimum selling price not found.
 */
router.get(
  '/:minimumSellingPriceId',
  minimumSellingPricesController.getMinimumSellingPriceById,
);

/**
 * @swagger
 * /minimumSellingPrices:
 *   post:
 *     summary: Create a new minimum selling price
 *     tags: [Minimum Selling Prices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MinimumSellingPrice'
 *     responses:
 *       201:
 *         description: The created minimum selling price.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MinimumSellingPrice'
 */
router.post('/', minimumSellingPricesController.createMinimumSellingPrice);

/**
 * @swagger
 * /minimumSellingPrices/{minimumSellingPriceId}:
 *   patch:
 *     summary: Partially update an existing minimum selling price
 *     tags: [Minimum Selling Prices]
 *     parameters:
 *       - in: path
 *         name: minimumSellingPriceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the minimum selling price to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pricingRuleId:
 *                 type: integer
 *                 description: The ID of the pricing rule.
 *               enrolledInPanEu:
 *                 type: boolean
 *                 description: Indicates if enrolled in Pan EU.
 *               eligibleForPanEu:
 *                 type: boolean
 *                 description: Indicates if eligible for Pan EU.
 *               referralFeeCategoryId:
 *                 type: integer
 *                 description: The ID of the referral fee category.
 *               minimumMarginWanted:
 *                 type: decimal
 *                 description: The minimum margin wanted.
 *               minimumSellingPriceLocalAndPanEu:
 *                 type: decimal
 *                 description: The minimum selling price for Local and Pan EU.
 *               minimumSellingPriceEfn:
 *                 type: decimal
 *                 description: The minimum selling price for EFN.
 *               maximumSellingPriceLocalAndPanEu:
 *                 type: decimal
 *                 description: The maximum selling price for Local and Pan EU.
 *               maximumSellingPriceEfn:
 *                 type: decimal
 *                 description: The maximum selling price for EFN.
 *     responses:
 *       200:
 *         description: Minimum selling price updated successfully.
 *       404:
 *         description: Minimum selling price not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:minimumSellingPriceId',
  minimumSellingPricesController.updateMinimumSellingPrice,
);

/**
 * @swagger
 * /minimumSellingPrices/{minimumSellingPriceId}:
 *   delete:
 *     summary: Delete a minimum selling price
 *     tags: [Minimum Selling Prices]
 *     parameters:
 *       - in: path
 *         name: minimumSellingPriceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The minimum selling price ID
 *     responses:
 *       200:
 *         description: Minimum selling price was deleted.
 *       404:
 *         description: Minimum selling price not found.
 */
router.delete(
  '/:minimumSellingPriceId',
  minimumSellingPricesController.deleteMinimumSellingPrice,
);

module.exports = router;
