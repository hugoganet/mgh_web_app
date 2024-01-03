const express = require('express');
const router = express.Router();
const sellingPricesHistoryController = require('../controllers/sellingPricesHistoryController');

/**
 * @swagger
 * components:
 *  schemas:
 *    SellingPricesHistory:
 *      type: object
 *      required:
 *        - skuId
 *        - dailyPrice
 *        - currencyCode
 *        - date
 *      properties:
 *        skuId:
 *          type: integer
 *          description: The ID of the SKU.
 *        dailyPrice:
 *          type: number
 *          format: double
 *          description: The daily price of the SKU.
 *        currencyCode:
 *          type: string
 *          description: The currency code of the daily price.
 *        date:
 *          type: string
 *          format: date
 *          description: The date of the price record.
 * tags:
 *  name: SellingPricesHistory
 *  description: The selling prices history managing API
 */

/**
 * @swagger
 * /sellingPricesHistory:
 *   get:
 *     summary: Retrieve a list of selling prices history records
 *     tags: [SellingPricesHistory]
 *     responses:
 *       200:
 *         description: A list of selling prices history records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SellingPricesHistory'
 */
router.get('/', sellingPricesHistoryController.getAllSellingPricesHistory);

/**
 * @swagger
 * /sellingPricesHistory/{skuId}/{date}:
 *  get:
 *    summary: Get a single selling price history record by SKU ID and date
 *    tags: [SellingPricesHistory]
 *    parameters:
 *      - in: path
 *        name: skuId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The SKU ID
 *      - in: path
 *        name: date
 *        schema:
 *          type: string
 *          format: date
 *        required: true
 *        description: The date of the price record
 *    responses:
 *      200:
 *        description: Details of the selling price history record.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SellingPricesHistory'
 *      404:
 *        description: Selling price history record not found.
 */
router.get(
  '/:skuId/:date',
  sellingPricesHistoryController.getSellingPriceHistoryById,
);

/**
 * @swagger
 * /sellingPricesHistory:
 *  post:
 *    summary: Create a new selling price history record
 *    tags: [SellingPricesHistory]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SellingPricesHistory'
 *    responses:
 *      201:
 *        description: Selling price history record created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', sellingPricesHistoryController.createSellingPriceHistory);

/**
 * @swagger
 * /sellingPricesHistory/{skuId}/{date}:
 *   patch:
 *     summary: Partially update an existing selling price history record
 *     tags: [SellingPricesHistory]
 *     parameters:
 *       - in: path
 *         name: skuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The SKU ID
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date of the price record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dailyPrice:
 *                 type: number
 *                 format: double
 *                 description: The new daily price of the SKU.
 *               currencyCode:
 *                 type: string
 *                 description: The new currency code of the daily price.
 *     responses:
 *       200:
 *         description: Selling price history record updated successfully.
 *       404:
 *         description: Selling price history record not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:skuId/:date',
  sellingPricesHistoryController.updateSellingPriceHistory,
);

/**
 * @swagger
 * /sellingPricesHistory/{skuId}/{date}:
 *  delete:
 *    summary: Delete a selling price history record
 *    tags: [SellingPricesHistory]
 *    parameters:
 *      - in: path
 *        name: skuId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The SKU ID
 *      - in: path
 *        name: date
 *        schema:
 *          type: string
 *          format: date
 *        required: true
 *        description: The date of the price record
 *    responses:
 *      200:
 *        description: Selling price history record deleted successfully.
 *      404:
 *        description: Selling price history record not found.
 */
router.delete(
  '/:skuId/:date',
  sellingPricesHistoryController.deleteSellingPriceHistory,
);

module.exports = router;
