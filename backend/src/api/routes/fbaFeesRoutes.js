const express = require('express');
const router = express.Router();
const fbaFeesController = require('../controllers/fbaFeesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    FbaFee:
 *      type: object
 *      required:
 *        - asinId
 *        - packageLength
 *        - packageWidth
 *        - packageHeight
 *        - packageWeight
 *        - priceGridFbaFeeId
 *        - enrolledInPanEu
 *        - eligibleForPanEu
 *        - referralFeeCategoryId
 *        - minimumMarginWanted
 *        - minimumSellingPriceLocalAndPanEu
 *        - minimumSellingPriceEfn
 *        - maximumSellingPriceLocalAndPanEu
 *        - maximumSellingPriceEfn
 *      properties:
 *        fbaFeeId:
 *          type: integer
 *          description: The ID of the FBA fee.
 *        asinId:
 *          type: integer
 *          description: The ASIN ID associated with the fee.
 *        packageLength:
 *          type: number
 *          format: double
 *          description: The package length.
 *        packageWidth:
 *          type: number
 *          format: double
 *          description: The package width.
 *        packageHeight:
 *          type: number
 *          format: double
 *          description: The package height.
 *        packageWeight:
 *          type: number
 *          format: double
 *          description: The package weight.
 *        priceGridFbaFeeId:
 *          type: integer
 *          description: The price grid FBA fee ID.
 *        enrolledInPanEu:
 *          type: boolean
 *          description: Indicates if enrolled in Pan-EU.
 *        eligibleForPanEu:
 *          type: boolean
 *          description: Indicates if eligible for Pan-EU.
 *        referralFeeCategoryId:
 *          type: integer
 *          description: The referral fee category ID.
 *        minimumMarginWanted:
 *          type: number
 *          format: double
 *          description: The minimum margin wanted.
 *        minimumSellingPriceLocalAndPanEu:
 *          type: number
 *          format: double
 *          description: The minimum selling price for local and Pan-EU.
 *        minimumSellingPriceEfn:
 *          type: number
 *          format: double
 *          description: The minimum selling price for EFN.
 *        maximumSellingPriceLocalAndPanEu:
 *          type: number
 *          format: double
 *          description: The maximum selling price for local and Pan-EU.
 *        maximumSellingPriceEfn:
 *          type: number
 *          format: double
 *          description: The maximum selling price for EFN.
 * tags:
 *  name: FbaFees
 *  description: The FBA Fees managing API
 */

/**
 * @swagger
 * /fbaFees:
 *   get:
 *     summary: Retrieve a list of FBA fees
 *     tags: [FbaFees]
 *     responses:
 *       200:
 *         description: A list of FBA fees.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FbaFee'
 */
router.get('/', fbaFeesController.getAllFbaFees);

/**
 * @swagger
 * /fbaFees/{fbaFeeId}:
 *  get:
 *    summary: Get a single FBA fee by ID
 *    tags: [FbaFees]
 *    parameters:
 *      - in: path
 *        name: fbaFeeId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The FBA fee ID.
 *    responses:
 *      200:
 *        description: Details of the FBA fee.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FbaFee'
 *      404:
 *        description: FBA fee not found.
 */
router.get('/:fbaFeeId', fbaFeesController.getFbaFeeById);

/**
 * @swagger
 * /fbaFees:
 *  post:
 *    summary: Create a new FBA fee
 *    tags: [FbaFees]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/FbaFee'
 *    responses:
 *      201:
 *        description: FBA fee created successfully.
 */
router.post('/', fbaFeesController.createFbaFee);

/**
 * @swagger
 * /fbaFees/{fbaFeeId}:
 *   patch:
 *     summary: Partially update an existing FBA fee
 *     tags: [FbaFees]
 *     parameters:
 *       - in: path
 *         name: fbaFeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The FBA fee ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packageLength:
 *                 type: number
 *                 format: double
 *                 description: Updated package length.
 *               packageWidth:
 *                 type: number
 *                 format: double
 *                 description: Updated package width.
 *               packageHeight:
 *                 type: number
 *                 format: double
 *                 description: Updated package height.
 *               packageWeight:
 *                 type: number
 *                 format: double
 *                 description: Updated package weight.
 *               priceGridFbaFeeId:
 *                 type: integer
 *                 description: Updated price grid FBA fee ID.
 *               enrolledInPanEu:
 *                 type: boolean
 *                 description: Updated enrollment status in Pan-EU.
 *               eligibleForPanEu:
 *                 type: boolean
 *                 description: Updated eligibility status for Pan-EU.
 *               referralFeeCategoryId:
 *                 type: integer
 *                 description: Updated referral fee category ID.
 *               minimumMarginWanted:
 *                 type: number
 *                 format: double
 *                 description: Updated minimum margin wanted.
 *               minimumSellingPriceLocalAndPanEu:
 *                 type: number
 *                 format: double
 *                 description: Updated minimum selling price for local and Pan-EU.
 *               minimumSellingPriceEfn:
 *                 type: number
 *                 format: double
 *                 description: Updated minimum selling price for EFN.
 *               maximumSellingPriceLocalAndPanEu:
 *                 type: number
 *                 format: double
 *                 description: Updated maximum selling price for local and Pan-EU.
 *               maximumSellingPriceEfn:
 *                 type: number
 *                 format: double
 *                 description: Updated maximum selling price for EFN.
 *     responses:
 *       200:
 *         description: FBA fee updated successfully.
 *       404:
 *         description: FBA fee not found.
 *       400:
 *         description: Invalid input.
 */
router.patch('/:fbaFeeId', fbaFeesController.updateFbaFee);

/**
 * @swagger
 * /fbaFees/{fbaFeeId}:
 *  delete:
 *    summary: Delete an FBA fee
 *    tags: [FbaFees]
 *    parameters:
 *      - in: path
 *        name: fbaFeeId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The FBA fee ID.
 *    responses:
 *      200:
 *        description: FBA fee deleted successfully.
 *      404:
 *        description: FBA fee not found.
 */
router.delete('/:fbaFeeId', fbaFeesController.deleteFbaFee);

module.exports = router;
