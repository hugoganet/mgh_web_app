const express = require('express');
const router = express.Router();
const suppliersOrdersController = require('../controllers/suppliersOrdersController');

/**
 * @swagger
 * components:
 *  schemas:
 *    SupplierOrder:
 *      type: object
 *      required:
 *        - supplierId
 *        - supplierOrderMadeDate
 *        - warehouseId
 *        - supplierOrderNumberOfUnit
 *        - supplierOrderTotalPaidExc
 *        - supplierOrderDeliveryCostExc
 *        - supplierOrderDeliveryCostVatRate
 *        - supplierOrderVatPaid
 *      properties:
 *        supplierOrderId:
 *          type: integer
 *          description: The supplier order's ID.
 *        supplierId:
 *          type: integer
 *          description: The ID of the supplier.
 *        supplierOrderMadeDate:
 *          type: string
 *          format: date
 *          description: The date when the order was made.
 *        supplierOrderDeliveryDate:
 *          type: string
 *          format: date
 *          description: The expected delivery date of the order.
 *        warehouseId:
 *          type: integer
 *          description: The ID of the warehouse where the order is delivered.
 *        supplierOrderNumberOfUnit:
 *          type: integer
 *          description: The number of units ordered.
 *        supplierOrderTotalPaidExc:
 *          type: number
 *          format: float
 *          description: The total paid for the order excluding VAT.
 *        supplierOrderDeliveryCostExc:
 *          type: number
 *          format: float
 *          description: The delivery cost excluding VAT.
 *        supplierOrderDeliveryCostVatRate:
 *          type: number
 *          format: float
 *          description: The VAT rate for the delivery cost.
 *        supplierOrderVatPaid:
 *          type: number
 *          format: float
 *          description: The VAT amount paid on the order.
 *        supplierOrderInvoiceFileLink:
 *          type: string
 *          description: The link to the invoice file of the order.
 * tags:
 *  name: Supplier Orders
 *  description: The API for managing supplier orders
 */

/**
 * @swagger
 * /suppliersOrders:
 *   get:
 *     summary: Retrieve a list of supplier orders
 *     tags: [Supplier Orders]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of Supplier's orders to return
 *     responses:
 *       200:
 *         description: A list of supplier orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupplierOrder'
 */
router.get('/', suppliersOrdersController.getAllSupplierOrders);

/**
 * @swagger
 * /suppliersOrders/{supplierOrderId}:
 *  get:
 *    summary: Get a single supplier order by its ID
 *    tags: [Supplier Orders]
 *    parameters:
 *      - in: path
 *        name: supplierOrderId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The supplier order ID
 *    responses:
 *      200:
 *        description: Details of the supplier order.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SupplierOrder'
 *      404:
 *        description: Supplier order not found.
 */
router.get('/:supplierOrderId', suppliersOrdersController.getSupplierOrderById);

/**
 * @swagger
 * /suppliersOrders:
 *  post:
 *    summary: Create a new supplier order
 *    tags: [Supplier Orders]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SupplierOrder'
 *    responses:
 *      201:
 *        description: Supplier order created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', suppliersOrdersController.createSupplierOrder);

/**
 * @swagger
 * /suppliersOrders/{supplierOrderId}:
 *   patch:
 *     summary: Partially update an existing supplier order
 *     tags: [Supplier Orders]
 *     parameters:
 *       - in: path
 *         name: supplierOrderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The supplier order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId:
 *                 type: integer
 *               supplierOrderMadeDate:
 *                 type: string
 *                 format: date
 *               supplierOrderDeliveryDate:
 *                 type: string
 *                 format: date
 *               warehouseId:
 *                 type: integer
 *               supplierOrderNumberOfUnit:
 *                 type: integer
 *               supplierOrderTotalPaidExc:
 *                 type: number
 *                 format: float
 *               supplierOrderDeliveryCostExc:
 *                 type: number
 *                 format: float
 *               supplierOrderDeliveryCostVatRate:
 *                 type: number
 *                 format: float
 *               supplierOrderVatPaid:
 *                 type: number
 *                 format: float
 *               supplierOrderInvoiceFileLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier order updated successfully.
 *       404:
 *         description: Supplier order not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:supplierOrderId',
  suppliersOrdersController.updateSupplierOrder,
);

/**
 * @swagger
 * /suppliersOrders/{supplierOrderId}:
 *   delete:
 *     summary: Delete a supplier order
 *     tags: [Supplier Orders]
 *     parameters:
 *       - in: path
 *         name: supplierOrderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The supplier order ID
 *     responses:
 *       200:
 *         description: Supplier order deleted successfully.
 *       404:
 *         description: Supplier order not found.
 */
router.delete(
  '/:supplierOrderId',
  suppliersOrdersController.deleteSupplierOrder,
);

module.exports = router;
