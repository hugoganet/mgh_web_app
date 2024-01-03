const express = require('express');
const router = express.Router();
const afnInventoryDailyUpdatesController = require('../controllers/afnInventoryDailyUpdateController');

/**
 * @swagger
 * components:
 *  schemas:
 *    AfnInventoryDailyUpdate:
 *      type: object
 *      required:
 *        - skuId
 *        - sku
 *        - countryCode
 *        - actualPrice
 *        - currencyCode
 *        - afnFulfillableQuantity
 *      properties:
 *        afnInventoryDailyUpdateId:
 *          type: integer
 *          description: The primary key for the inventory update records.
 *        skuId:
 *          type: integer
 *          description: Foreign key to the SKU.
 *        sku:
 *          type: string
 *          description: SKU identifier.
 *        countryCode:
 *          type: string
 *          description: The country code.
 *        actualPrice:
 *          type: number
 *          format: double
 *          description: The actual price.
 *        currencyCode:
 *          type: string
 *          description: The currency code.
 *        afnFulfillableQuantity:
 *          type: integer
 *          description: The fulfillable quantity in Amazon FBA.
 *        reportDocumentId:
 *          type: string
 *          description: The ID of the report document.
 * tags:
 *  name: AfnInventoryDailyUpdates
 *  description: The Amazon FBA Inventory Daily Updates managing API
 */

/**
 * @swagger
 * /afnInventoryDailyUpdates:
 *   get:
 *     summary: Retrieve a list of Amazon FBA Inventory Daily Updates
 *     tags: [AfnInventoryDailyUpdates]
 *     responses:
 *       200:
 *         description: A list of Amazon FBA Inventory Daily Updates.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AfnInventoryDailyUpdate'
 */
router.get(
  '/',
  afnInventoryDailyUpdatesController.getAllAfnInventoryDailyUpdates,
);

/**
 * @swagger
 * /afnInventoryDailyUpdates/{afnInventoryDailyUpdateId}:
 *  get:
 *    summary: Get a single Amazon FBA Inventory Daily Update by ID
 *    tags: [AfnInventoryDailyUpdates]
 *    parameters:
 *      - in: path
 *        name: afnInventoryDailyUpdateId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The inventory daily update ID
 *    responses:
 *      200:
 *        description: Details of the Amazon FBA Inventory Daily Update.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AfnInventoryDailyUpdate'
 *      404:
 *        description: Amazon FBA Inventory Daily Update not found.
 */
router.get(
  '/:afnInventoryDailyUpdateId',
  afnInventoryDailyUpdatesController.getAfnInventoryDailyUpdateById,
);

/**
 * @swagger
 * /afnInventoryDailyUpdates:
 *  post:
 *    summary: Create a new Amazon FBA Inventory Daily Update
 *    tags: [AfnInventoryDailyUpdates]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AfnInventoryDailyUpdate'
 *    responses:
 *      201:
 *        description: Amazon FBA Inventory Daily Update created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post(
  '/',
  afnInventoryDailyUpdatesController.createAfnInventoryDailyUpdate,
);

/**
 * @swagger
 * /afnInventoryDailyUpdates/{afnInventoryDailyUpdateId}:
 *   patch:
 *     summary: Partially update an existing Amazon FBA Inventory Daily Update
 *     tags: [AfnInventoryDailyUpdates]
 *     parameters:
 *       - in: path
 *         name: afnInventoryDailyUpdateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The inventory daily update ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skuId:
 *                 type: integer
 *                 description: Foreign key to the SKU.
 *               sku:
 *                 type: string
 *                 description: SKU identifier.
 *               countryCode:
 *                 type: string
 *                 description: The country code.
 *               actualPrice:
 *                 type: number
 *                 format: double
 *                 description: The actual price.
 *               currencyCode:
 *                 type: string
 *                 description: The currency code.
 *               afnFulfillableQuantity:
 *                 type: integer
 *                 description: The fulfillable quantity in Amazon FBA.
 *               reportDocumentId:
 *                 type: string
 *                 description: The ID of the report document.
 *     responses:
 *       200:
 *         description: Amazon FBA Inventory Daily Update updated successfully.
 *       404:
 *         description: Amazon FBA Inventory Daily Update not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:afnInventoryDailyUpdateId',
  afnInventoryDailyUpdatesController.updateAfnInventoryDailyUpdate,
);

/**
 * @swagger
 * /afnInventoryDailyUpdates/{afnInventoryDailyUpdateId}:
 *  delete:
 *    summary: Delete an Amazon FBA Inventory Daily Update
 *    tags: [AfnInventoryDailyUpdates]
 *    parameters:
 *      - in: path
 *        name: afnInventoryDailyUpdateId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The inventory daily update ID
 *    responses:
 *      200:
 *        description: Amazon FBA Inventory Daily Update deleted successfully.
 *      404:
 *        description: Amazon FBA Inventory Daily Update not found.
 */
router.delete(
  '/:afnInventoryDailyUpdateId',
  afnInventoryDailyUpdatesController.deleteAfnInventoryDailyUpdate,
);

module.exports = router;
