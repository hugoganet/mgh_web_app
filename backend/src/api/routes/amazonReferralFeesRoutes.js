const express = require('express');
const router = express.Router();
const amazonReferralFeesController = require('../controllers/amazonReferralFeesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    AmazonReferralFee:
 *      type: object
 *      required:
 *        - countryCode
 *        - referralFeeCategoryNameEn
 *        - referralFeePercentage
 *        - perItemMinimumReferralFee
 *        - closingFee
 *      properties:
 *        referralFeeCategoryId:
 *          type: integer
 *          description: The referral fee category ID.
 *        countryCode:
 *          type: string
 *          description: The country code.
 *        referralFeeCategoryNameEn:
 *          type: string
 *          description: The English name of the referral fee category.
 *        referralFeePercentage:
 *          type: number
 *          format: double
 *          description: The referral fee percentage.
 *        reducedReferralFeePercentage:
 *          type: number
 *          format: double
 *          description: The reduced referral fee percentage.
 *        reducedReferralFeeLimit:
 *          type: number
 *          format: double
 *          description: The reduced referral fee limit.
 *        reducedReferralFeeThreshold:
 *          type: number
 *          format: double
 *          description: The reduced referral fee threshold.
 *        perItemMinimumReferralFee:
 *          type: number
 *          format: double
 *          description: The per item minimum referral fee.
 *        closingFee:
 *          type: number
 *          format: double
 *          description: The closing fee.
 * tags:
 *  name: AmazonReferralFees
 *  description: The Amazon referral fees managing API
 */

/**
 * @swagger
 * /amazonReferralFees:
 *   get:
 *     summary: Retrieve a list of Amazon referral fees
 *     tags: [AmazonReferralFees]
 *     responses:
 *       200:
 *         description: A list of Amazon referral fees.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AmazonReferralFee'
 */
router.get('/', amazonReferralFeesController.getAllAmazonReferralFees);

/**
 * @swagger
 * /amazonReferralFees/{referralFeeCategoryId}:
 *  get:
 *    summary: Get a single Amazon referral fee by ID
 *    tags: [AmazonReferralFees]
 *    parameters:
 *      - in: path
 *        name: referralFeeCategoryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The referral fee category ID
 *    responses:
 *      200:
 *        description: Details of the Amazon referral fee.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AmazonReferralFee'
 *      404:
 *        description: Amazon referral fee not found.
 */
router.get(
  '/:referralFeeCategoryId',
  amazonReferralFeesController.getAmazonReferralFeeById,
);

/**
 * @swagger
 * /amazonReferralFees:
 *  post:
 *    summary: Create a new Amazon referral fee
 *    tags: [AmazonReferralFees]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AmazonReferralFee'
 *    responses:
 *      201:
 *        description: Amazon referral fee created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', amazonReferralFeesController.createAmazonReferralFee);

/**
 * @swagger
 * /amazonReferralFees/{referralFeeCategoryId}:
 *   patch:
 *     summary: Partially update an existing Amazon referral fee
 *     tags: [AmazonReferralFees]
 *     parameters:
 *       - in: path
 *         name: referralFeeCategoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The referral fee category ID
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
 *               referralFeeCategoryNameEn:
 *                 type: string
 *                 description: The English name of the referral fee category.
 *               referralFeePercentage:
 *                 type: number
 *                 format: double
 *                 description: The referral fee percentage.
 *               reducedReferralFeePercentage:
 *                 type: number
 *                 format: double
 *                 description: The reduced referral fee percentage.
 *               reducedReferralFeeLimit:
 *                 type: number
 *                 format: double
 *                 description: The reduced referral fee limit.
 *               reducedReferralFeeThreshold:
 *                 type: number
 *                 format: double
 *                 description: The reduced referral fee threshold.
 *               perItemMinimumReferralFee:
 *                 type: number
 *                 format: double
 *                 description: The per item minimum referral fee.
 *               closingFee:
 *                 type: number
 *                 format: double
 *                 description: The closing fee.
 *     responses:
 *       200:
 *         description: Amazon referral fee updated successfully.
 *       404:
 *         description: Amazon referral fee not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:referralFeeCategoryId',
  amazonReferralFeesController.updateAmazonReferralFee,
);

/**
 * @swagger
 * /amazonReferralFees/{referralFeeCategoryId}:
 *  delete:
 *    summary: Delete an Amazon referral fee
 *    tags: [AmazonReferralFees]
 *    parameters:
 *      - in: path
 *        name: referralFeeCategoryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The referral fee category ID
 *    responses:
 *      200:
 *        description: Amazon referral fee deleted successfully.
 *      404:
 *        description: Amazon referral fee not found.
 */
router.delete(
  '/:referralFeeCategoryId',
  amazonReferralFeesController.deleteAmazonReferralFee,
);

module.exports = router;
