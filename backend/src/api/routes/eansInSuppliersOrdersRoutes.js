const express = require('express');
const router = express.Router();
const eansInSuppliersOrdersController = require('../controllers/eansInSuppliersOrdersController');

/**
 * @swagger
 * components:
 *  schemas:
 *    EanInSupplierOrder:
 *      type: object
 *      required:
 *        - ean
 *        - supplierOrderId
 *        - eanOrderedQuantity
 *        - productPurchaseCostExc
 *        - productVatRate
 *      properties:
 *        eanInSupplierOrderId:
 *          type: integer
 *          description: The unique identifier for the EAN in the supplier order.
 *        ean:
 *          type: integer
 *          description: The EAN code associated with the supplier order.
 *        supplierOrderId:
 *          type: integer
 *          description: The supplier order ID.
 *        eanOrderedQuantity:
 *          type: integer
 *          description: The quantity of the EAN ordered.
 *        eanReceivedQuantity:
 *          type: integer
 *          description: The quantity of the EAN received.
 *        productPurchaseCostExc:
 *          type: number
 *          format: decimal
 *          description: The purchase cost of the product excluding VAT.
 *        productVatRate:
 *          type: number
 *          format: decimal
 *          description: The VAT rate for the product.
 *        bestBeforeDate:
 *          type: string
 *          format: date
 *          description: The best before date of the product.
 * tags:
 *  name: EansInSuppliersOrders
 *  description: The Eans in Suppliers Orders managing API
 */

/**
 * @swagger
 * /eansInSuppliersOrders:
 *   get:
 *     summary: Retrieve a list of EANs in suppliers orders
 *     tags: [EansInSuppliersOrders]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of Eans to return
 *     responses:
 *       200:
 *         description: A list of EANs in suppliers orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EanInSupplierOrder'
 */

router.get('/', eansInSuppliersOrdersController.getAllEansInSuppliersOrders);

/**
 * @swagger
 * /eansInSuppliersOrders/{eanInSupplierOrderId}:
 *   get:
 *     summary: Get a single EAN in a supplier order by its ID
 *     tags: [EansInSuppliersOrders]
 *     parameters:
 *       - in: path
 *         name: eanInSupplierOrderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The eanInSupplierOrderId ID
 *     responses:
 *       200:
 *         description: Details of the EAN in the supplier order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EanInSupplierOrder'
 *       404:
 *         description: EAN in supplier order not found.
 */

router.get(
  '/:eanInSupplierOrderId',
  eansInSuppliersOrdersController.getEanInSupplierOrderById,
);

/**
 * @swagger
 * /eansInSuppliersOrders:
 *   post:
 *     summary: Create a new EAN in a supplier order
 *     tags: [EansInSuppliersOrders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EanInSupplierOrder'
 *     responses:
 *       201:
 *         description: EAN in supplier order created successfully.
 *       400:
 *         description: Invalid input.
 */

router.post('/', eansInSuppliersOrdersController.createEanInSupplierOrder);

/**
 * @swagger
 * /eansInSuppliersOrders/{eanInSupplierOrderId}:
 *   patch:
 *     summary: Partially update an existing EAN in a supplier order
 *     tags: [EansInSuppliersOrders]
 *     parameters:
 *       - in: path
 *         name: eanInSupplierOrderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The eanInSupplierOrderId ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ean:
 *                 type: integer
 *                 description: The EAN code associated with the supplier order.
 *               supplierOrderId:
 *                 type: integer
 *                 description: The supplier order ID.
 *               eanOrderedQuantity:
 *                 type: integer
 *                 description: The quantity of the EAN ordered.
 *               eanReceivedQuantity:
 *                 type: integer
 *                 description: The quantity of the EAN received.
 *               productPurchaseCostExc:
 *                 type: number
 *                 format: decimal
 *                 description: The purchase cost of the product excluding VAT.
 *               productVatRate:
 *                 type: number
 *                 format: decimal
 *                 description: The VAT rate for the product.
 *               bestBeforeDate:
 *                 type: string
 *                 format: date
 *                 description: The best before date of the product.
 *     responses:
 *       200:
 *         description: EAN in supplier order updated successfully.
 *       404:
 *         description: EAN in supplier order not found.
 *       400:
 *         description: Invalid input.
 */

router.patch(
  '/:eanInSupplierOrderId',
  eansInSuppliersOrdersController.updateEanInSupplierOrder,
);

/**
 * @swagger
 * /eansInSuppliersOrders/{eanInSupplierOrderId}:
 *   delete:
 *     summary: Delete an EAN in a supplier order
 *     tags: [EansInSuppliersOrders]
 *     parameters:
 *       - in: path
 *         name: eanInSupplierOrderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The eanInSupplierOrderId ID
 *     responses:
 *       200:
 *         description: EAN in supplier order deleted successfully.
 *       404:
 *         description: EAN in supplier order not found.
 */

router.delete(
  '/:eanInSupplierOrderId',
  eansInSuppliersOrdersController.deleteEanInSupplierOrder,
);

module.exports = router;
