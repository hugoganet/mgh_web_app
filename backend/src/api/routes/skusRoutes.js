const express = require('express');
const router = express.Router();
const skusController = require('../controllers/skusController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Sku:
 *      type: object
 *      required:
 *        - sku
 *        - countryCode
 *        - skuAcquisitionCostExc
 *        - skuAcquisitionCostInc
 *        - skuAfnTotalQuantity
 *        - numberOfUnitSold
 *      properties:
 *        skuId:
 *          type: integer
 *          description: The ID of the SKU (auto-generated)
 *        sku:
 *          type: string
 *          description: SKU code
 *        countryCode:
 *          type: string
 *          description: Country code
 *        fnsku:
 *          type: string
 *          description: FNSKU code
 *        skuAcquisitionCostExc:
 *          type: number
 *          format: float
 *          description: SKU acquisition cost excluding taxes
 *        skuAcquisitionCostInc:
 *          type: number
 *          format: float
 *          description: SKU acquisition cost including taxes
 *        skuAfnTotalQuantity:
 *          type: integer
 *          description: Total quantity of SKU in AFN
 *        skuAverageSellingPrice:
 *          type: number
 *          format: float
 *          description: Average selling price of the SKU
 *        skuAverageNetMargin:
 *          type: number
 *          format: float
 *          description: Average net margin of the SKU
 *        skuAverageNetMarginPercentage:
 *          type: number
 *          format: float
 *          description: Average net margin percentage of the SKU
 *        skuAverageReturnOnInvestmentRate:
 *          type: number
 *          format: float
 *          description: Average return on investment rate
 *        skuAverageDailyReturnOnInvestmentRate:
 *          type: number
 *          format: float
 *          description: Average daily return on investment rate
 *        isActive:
 *          type: boolean
 *          description: Indicates if the SKU is active
 *        numberOfActiveDays:
 *          type: integer
 *          description: Number of active days for the SKU
 *        numberOfUnitSold:
 *          type: integer
 *          description: Number of units sold
 *        skuAverageUnitSoldPerDay:
 *          type: number
 *          format: float
 *          description: Average units sold per day
 *        skuRestockAlertQuantity:
 *          type: integer
 *          description: Restock alert quantity for the SKU
 *        skuIsTest:
 *          type: boolean
 *          description: Indicates if the SKU is a test SKU
 * tags:
 *  name: Skus
 *  description: The SKUs managing API
 */

/**
 * @swagger
 * /skus:
 *   get:
 *     summary: Retrieve a list of SKUs
 *     tags: [Skus]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of ASINs to return
 *     responses:
 *       200:
 *         description: A list of SKUs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sku'
 */
router.get('/', skusController.getAllSkus);

/**
 * @swagger
 * /skus/{skuId}:
 *   get:
 *     summary: Retrieve a single SKU by ID
 *     tags: [Skus]
 *     parameters:
 *       - in: path
 *         name: skuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the SKU to retrieve
 *     responses:
 *       200:
 *         description: Details of the SKU.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sku'
 *       404:
 *         description: SKU not found.
 */
router.get('/:skuId', skusController.getSkuById);

/**
 * @swagger
 * /skus:
 *   post:
 *     summary: Create a new SKU
 *     tags: [Skus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sku'
 *     responses:
 *       201:
 *         description: SKU created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/', skusController.createSku);

/**
 * @swagger
 * /skus/{skuId}:
 *   patch:
 *     summary: Partially update an existing SKU
 *     tags: [Skus]
 *     parameters:
 *       - in: path
 *         name: skuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the SKU to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryCode:
 *                 type: string
 *                 description: The country code associated with the SKU.
 *               fnsku:
 *                 type: string
 *                 description: Fulfillment Network Stock Keeping Unit identifier.
 *               skuAcquisitionCostExc:
 *                 type: number
 *                 format: decimal
 *                 description: Exclusive acquisition cost of the SKU.
 *               skuAcquisitionCostInc:
 *                 type: number
 *                 format: decimal
 *                 description: Inclusive acquisition cost of the SKU.
 *               skuAfnTotalQuantity:
 *                 type: integer
 *                 description: Total quantity of SKU in Amazon Fulfillment Network.
 *               skuAverageSellingPrice:
 *                 type: number
 *                 format: decimal
 *                 description: Average selling price of the SKU.
 *               skuAverageNetMargin:
 *                 type: number
 *                 format: decimal
 *                 description: Net margin for the SKU.
 *               skuAverageNetMarginPercentage:
 *                 type: number
 *                 format: decimal
 *                 description: Net margin percentage for the SKU.
 *               skuAverageReturnOnInvestmentRate:
 *                 type: number
 *                 format: decimal
 *                 description: Average return on investment rate for the SKU.
 *               skuAverageDailyReturnOnInvestmentRate:
 *                 type: number
 *                 format: decimal
 *                 description: Daily return on investment rate for the SKU.
 *               isActive:
 *                 type: boolean
 *                 description: Whether the SKU is active or not.
 *               numberOfActiveDays:
 *                 type: integer
 *                 description: Number of active days for the SKU.
 *               numberOfUnitSold:
 *                 type: integer
 *                 description: Number of units sold.
 *               skuAverageUnitSoldPerDay:
 *                 type: number
 *                 format: decimal
 *                 description: Average units sold per day.
 *               skuRestockAlertQuantity:
 *                 type: integer
 *                 description: Alert quantity for SKU restock.
 *               skuIsTest:
 *                 type: boolean
 *                 description: Whether the SKU is a test SKU.
 *     responses:
 *       200:
 *         description: SKU updated successfully.
 *       404:
 *         description: SKU not found.
 *       400:
 *         description: Invalid input.
 */

router.patch('/:skuId', skusController.updateSku);

/**
 * @swagger
 * /skus/{skuId}:
 *   delete:
 *     summary: Delete a SKU
 *     tags: [Skus]
 *     parameters:
 *       - in: path
 *         name: skuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the SKU to delete
 *     responses:
 *       200:
 *         description: SKU deleted successfully.
 *       404:
 *         description: SKU not found.
 */
router.delete('/:skuId', skusController.deleteSku);

module.exports = router;
