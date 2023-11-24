const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliersController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Supplier:
 *      type: object
 *      required:
 *        - supplierName
 *        - productCategoryId
 *      properties:
 *        supplierId:
 *          type: integer
 *          description: The ID of the supplier.
 *        productCategoryId:
 *          type: integer
 *          description: The product category ID associated with the supplier.
 *        supplierName:
 *          type: string
 *          description: Name of the supplier.
 *        supplierWebsite:
 *          type: string
 *          description: Website of the supplier.
 *        supplierNumber:
 *          type: string
 *          description: Contact number of the supplier.
 *        supplierEmail:
 *          type: string
 *          description: Email of the supplier.
 *        supplierAddress:
 *          type: string
 *          description: Address of the supplier.
 *        supplierPostcode:
 *          type: string
 *          description: Postcode of the supplier.
 *        countryCode:
 *          type: string
 *          description: Country code of the supplier.
 *        supplierNote:
 *          type: string
 *          description: Additional notes about the supplier.
 *        contactName:
 *          type: string
 *          description: Name of the contact person.
 *        contactPosition:
 *          type: string
 *          description: Position of the contact person.
 *        contactNumber:
 *          type: string
 *          description: Contact number of the contact person.
 *        contactEmail:
 *          type: string
 *          description: Email of the contact person.
 *        accountOpen:
 *          type: boolean
 *          description: Indicates if the account with the supplier is open.
 *        accountRefused:
 *          type: boolean
 *          description: Indicates if the account with the supplier was refused.
 *        accountRefusedDate:
 *          type: string
 *          format: date
 *          description: The date when the account was refused.
 *        accountRefusedReason:
 *          type: string
 *          description: The reason for account refusal.
 *        isInteresting:
 *          type: boolean
 *          description: Flags if the supplier is considered interesting.
 *        isBrand:
 *          type: boolean
 *          description: Flags if the supplier is a brand.
 * tags:
 *  name: Suppliers
 *  description: Managing API for suppliers
 */

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Retrieve a list of suppliers
 *     tags: [Suppliers]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of suppliers to return
 *     responses:
 *       200:
 *         description: A list of suppliers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
router.get('/', suppliersController.getAllSuppliers);

/**
 * @swagger
 * /suppliers/{supplierId}:
 *   get:
 *     summary: Retrieve a single supplier by its ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the supplier
 *     responses:
 *       200:
 *         description: Details of the supplier.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found.
 */
router.get('/:supplierId', suppliersController.getSupplierById);

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/', suppliersController.createSupplier);

/**
 * @swagger
 * /suppliers/{supplierId}:
 *   patch:
 *     summary: Partially update an existing supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the supplier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productCategoryId:
 *                 type: integer
 *                 description: The product category ID associated with the supplier.
 *               supplierName:
 *                 type: string
 *                 description: Name of the supplier.
 *               supplierWebsite:
 *                 type: string
 *                 description: Website of the supplier.
 *               supplierNumber:
 *                 type: string
 *                 description: Contact number of the supplier.
 *               supplierEmail:
 *                 type: string
 *                 description: Email of the supplier.
 *               supplierAddress:
 *                 type: string
 *                 description: Address of the supplier.
 *               supplierPostcode:
 *                 type: string
 *                 description: Postcode of the supplier.
 *               countryCode:
 *                 type: string
 *                 description: Country code of the supplier.
 *               supplierNote:
 *                 type: string
 *                 description: Additional notes about the supplier.
 *               contactName:
 *                 type: string
 *                 description: Name of the contact person.
 *               contactPosition:
 *                 type: string
 *                 description: Position of the contact person.
 *               contactNumber:
 *                 type: string
 *                 description: Contact number of the contact person.
 *               contactEmail:
 *                 type: string
 *                 description: Email of the contact person.
 *               accountOpen:
 *                 type: boolean
 *                 description: Indicates if the account with the supplier is open.
 *               accountRefused:
 *                 type: boolean
 *                 description: Indicates if the account with the supplier was refused.
 *               accountRefusedDate:
 *                 type: string
 *                 format: date
 *                 description: The date when the account was refused.
 *               accountRefusedReason:
 *                 type: string
 *                 description: The reason for account refusal.
 *               isInteresting:
 *                 type: boolean
 *                 description: Flags if the supplier is considered interesting.
 *               isBrand:
 *                 type: boolean
 *                 description: Flags if the supplier is a brand.
 *     responses:
 *       200:
 *         description: Supplier updated successfully.
 *       404:
 *         description: Supplier not found.
 *       400:
 *         description: Invalid input.
 */
router.patch('/:supplierId', suppliersController.updateSupplier);

/**
 * @swagger
 * /suppliers/{supplierId}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the supplier
 *     responses:
 *       200:
 *         description: Supplier deleted successfully.
 *       404:
 *         description: Supplier not found.
 */
router.delete('/:supplierId', suppliersController.deleteSupplier);

module.exports = router;
