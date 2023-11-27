const express = require('express');
const router = express.Router();
const eansInDonationsController = require('../controllers/eansInDonationsController');

/**
 * @swagger
 * components:
 *  schemas:
 *    EanInDonation:
 *      type: object
 *      required:
 *        - ean
 *        - donationId
 *        - eanDonationQuantity
 *      properties:
 *        eanInDonationId:
 *          type: integer
 *          description: The ID of the EAN in donation.
 *        ean:
 *          type: string
 *          description: The EAN code.
 *        donationId:
 *          type: integer
 *          description: The ID of the donation.
 *        eanDonationQuantity:
 *          type: integer
 *          description: Quantity of EAN donated.
 * tags:
 *  name: EansInDonations
 *  description: The Eans in Donations managing API
 */

/**
 * @swagger
 * /eansInDonations:
 *   get:
 *     summary: Retrieve a list of EANs in donations
 *     tags: [EansInDonations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of EansInDonations to return
 *     responses:
 *       200:
 *         description: A list of EANs in donations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EanInDonation'
 *       400:
 *         description: Invalid input.
 */
router.get('/', eansInDonationsController.getAllEansInDonations);

/**
 * @swagger
 * /eansInDonations/{eanInDonationId}:
 *  get:
 *    summary: Get a single EAN in donation by ID
 *    tags: [EansInDonations]
 *    parameters:
 *      - in: path
 *        name: eanInDonationId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the EAN in donation
 *    responses:
 *      200:
 *        description: Details of the EAN in donation.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EanInDonation'
 *      404:
 *        description: EAN in donation not found.
 */
router.get('/:eanInDonationId', eansInDonationsController.getEanInDonationById);

/**
 * @swagger
 * /eansInDonations:
 *  post:
 *    summary: Create a new EAN in donation
 *    tags: [EansInDonations]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EanInDonation'
 *    responses:
 *      201:
 *        description: EAN in donation created successfully.
 *      400:
 *        description: Invalid input.
 */
router.post('/', eansInDonationsController.createEanInDonation);

/**
 * @swagger
 * /eansInDonations/{eanInDonationId}:
 *   patch:
 *     summary: Partially update an existing EAN in donation
 *     tags: [EansInDonations]
 *     parameters:
 *       - in: path
 *         name: eanInDonationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the EAN in donation to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ean:
 *                 type: string
 *                 description: The EAN code.
 *               donationId:
 *                 type: integer
 *                 description: The ID of the donation.
 *               eanDonationQuantity:
 *                 type: integer
 *                 description: Quantity of EAN donated.
 *     responses:
 *       200:
 *         description: EAN in donation updated successfully.
 *       404:
 *         description: EAN in donation not found.
 *       400:
 *         description: Invalid input.
 */
router.patch(
  '/:eanInDonationId',
  eansInDonationsController.updateEanInDonation,
);

/**
 * @swagger
 * /eansInDonations/{eanInDonationId}:
 *  delete:
 *    summary: Delete an EAN in donation
 *    tags: [EansInDonations]
 *    parameters:
 *      - in: path
 *        name: eanInDonationId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the EAN in donation
 *    responses:
 *      200:
 *        description: EAN in donation deleted successfully.
 *      404:
 *        description: EAN in donation not found.
 */
router.delete(
  '/:eanInDonationId',
  eansInDonationsController.deleteEanInDonation,
);

module.exports = router;
