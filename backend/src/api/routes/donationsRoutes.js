const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donationsController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Donation:
 *      type: object
 *      required:
 *        - donationId
 *        - warehouseId
 *        - donationTo
 *        - donationDate
 *      properties:
 *        donationId:
 *          type: integer
 *          description: The unique identifier for the donation.
 *        warehouseId:
 *          type: integer
 *          description: The identifier for the warehouse where the donation originated.
 *        donationTo:
 *          type: string
 *          description: The recipient of the donation.
 *        donationDate:
 *          type: string
 *          format: date
 *          description: The date of the donation.
 *        donationNote:
 *          type: string
 *          description: Additional notes about the donation.
 * tags:
 *  name: Donations
 *  description: Managing donations
 */

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Retrieve a list of donations
 *     tags: [Donations]
 *     responses:
 *       200:
 *         description: A list of donations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 */
router.get('/', donationsController.getAllDonations);

/**
 * @swagger
 * /donations/{donationId}:
 *   get:
 *     summary: Get a single donation by its ID
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: donationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The donation ID.
 *     responses:
 *       200:
 *         description: Details of the donation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donation not found.
 */
router.get('/:donationId', donationsController.getDonationById);

/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Create a new donation
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Donation'
 *     responses:
 *       201:
 *         description: Donation created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/', donationsController.createDonation);

/**
 * @swagger
 * /donations/{donationId}:
 *   patch:
 *     summary: Partially update an existing donation
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: donationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The donation ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               warehouseId:
 *                 type: integer
 *                 description: The warehouse ID.
 *               donationTo:
 *                 type: string
 *                 description: The recipient of the donation.
 *               donationDate:
 *                 type: string
 *                 format: date
 *                 description: The date of the donation.
 *               donationNote:
 *                 type: string
 *                 description: Additional notes about the donation.
 *     responses:
 *       200:
 *         description: Donation updated successfully.
 *       404:
 *         description: Donation not found.
 *       400:
 *         description: Invalid input.
 */
router.patch('/:donationId', donationsController.updateDonation);

/**
 * @swagger
 * /donations/{donationId}:
 *   delete:
 *     summary: Delete a donation
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: donationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The donation ID.
 *     responses:
 *       200:
 *         description: Donation deleted successfully.
 *       404:
 *         description: Donation not found.
 */
router.delete('/:donationId', donationsController.deleteDonation);

module.exports = router;
