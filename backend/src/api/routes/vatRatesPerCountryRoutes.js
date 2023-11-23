const express = require('express');
const router = express.Router();
const vatRatesPerCountryController = require('../controllers/vatRatesPerCountryController');

/**
 * @swagger
 * components:
 *  schemas:
 *    VatRatePerCountry:
 *      type: object
 *      required:
 *        - countryCode
 *        - vatCategoryId
 *      properties:
 *        vatRatePerCountryId:
 *          type: integer
 *          description: The ID of the VAT rate per country record.
 *        countryCode:
 *          type: string
 *          description: The country code.
 *        vatCategoryId:
 *          type: string
 *          description: The VAT category ID.
 * tags:
 *  name: VatRatesPerCountry
 *  description: The VAT rates per country managing API
 */

/**
 * @swagger
 * /vatRatesPerCountry:
 *   get:
 *     summary: Retrieve a list of VAT rates per country
 *     tags: [VatRatesPerCountry]
 *     responses:
 *       200:
 *         description: A list of VAT rates per country.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VatRatePerCountry'
 */

router.get('/', vatRatesPerCountryController.getAllVatRatesPerCountry);

/**
 * @swagger
 * /vatRatesPerCountry/{vatRatePerCountryId}:
 *  get:
 *    summary: Get a single VAT rate per country by ID
 *    tags: [VatRatesPerCountry]
 *    parameters:
 *      - in: path
 *        name: vatRatePerCountryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The VAT rate per country ID
 *    responses:
 *      200:
 *        description: Details of the VAT rate per country.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/VatRatePerCountry'
 *      404:
 *        description: VAT rate per country not found.
 */

router.get(
  '/:vatRatePerCountryId',
  vatRatesPerCountryController.getVatRatePerCountryById,
);

/**
 * @swagger
 * /vatRatesPerCountry:
 *  post:
 *    summary: Create a new VAT rate per country
 *    tags: [VatRatesPerCountry]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/VatRatePerCountry'
 *    responses:
 *      201:
 *        description: VAT rate per country created successfully.
 *      400:
 *        description: Invalid input.
 */

router.post('/', vatRatesPerCountryController.createVatRatePerCountry);

/**
 * @swagger
 * /vatRatesPerCountry/{vatRatePerCountryId}:
 *   patch:
 *     summary: Partially update an existing VAT rate per country
 *     tags: [VatRatesPerCountry]
 *     parameters:
 *       - in: path
 *         name: vatRatePerCountryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the VAT rate per country to update
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
 *               vatCategoryId:
 *                 type: string
 *                 description: The VAT category ID.
 *     responses:
 *       200:
 *         description: VAT rate per country updated successfully.
 *       404:
 *         description: VAT rate per country not found.
 *       400:
 *         description: Invalid input.
 */

router.patch(
  '/:vatRatePerCountryId',
  vatRatesPerCountryController.updateVatRatePerCountry,
);

/**
 * @swagger
 * /vatRatesPerCountry/{vatRatePerCountryId}:
 *  delete:
 *    summary: Delete a VAT rate per country
 *    tags: [VatRatesPerCountry]
 *    parameters:
 *      - in: path
 *        name: vatRatePerCountryId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The VAT rate per country ID
 *    responses:
 *      200:
 *        description: VAT rate per country deleted successfully.
 *      404:
 *        description: VAT rate per country not found.
 */

router.delete(
  '/:vatRatePerCountryId',
  vatRatesPerCountryController.deleteVatRatePerCountry,
);

module.exports = router;
