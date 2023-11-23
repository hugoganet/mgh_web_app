const express = require('express');
const router = express.Router();
const countriesController = require('../controllers/countriesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    Country:
 *      type: object
 *      required:
 *        - countryCode
 *        - countryName
 *      properties:
 *        countryCode:
 *          type: string
 *          description: The country's code.
 *        countryName:
 *          type: string
 *          description: The name of the country.
 * tags:
 *  name: Countries
 *  description: The countries managing API
 */

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Retrieve a list of countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: A list of countries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 */

router.get('/', countriesController.getAllCountries);

/**
 * @swagger
 * /countries/{countryCode}:
 *  get:
 *    summary: Get a single country by its code
 *    tags: [Countries]
 *    parameters:
 *      - in: path
 *        name: countryCode
 *        schema:
 *          type: string
 *        required: true
 *        description: The country code
 *    responses:
 *      200:
 *        description: Details of the country.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Country'
 *      404:
 *        description: Country not found.
 */

router.get('/:countryCode', countriesController.getCountryByCode);

/**
 * @swagger
 * /countries:
 *  post:
 *    summary: Create a new country
 *    tags: [Countries]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Country'
 *    responses:
 *      201:
 *        description: Country created successfully.
 *      400:
 *        description: Invalid input.
 */

router.post('/', countriesController.createCountry);

/**
 * @swagger
 * /countries/{countryCode}:
 *   patch:
 *     summary: Partially update an existing country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: countryCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The country code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryName:
 *                 type: string
 *                 description: The name of the country.
 *     responses:
 *       200:
 *         description: Country updated successfully.
 *       404:
 *         description: Country not found.
 *       400:
 *         description: Invalid input.
 */

router.patch('/:countryCode', countriesController.updateCountry);

/**
 * @swagger
 * /countries/{countryCode}:
 *  delete:
 *    summary: Delete a country
 *    tags: [Countries]
 *    parameters:
 *      - in: path
 *        name: countryCode
 *        schema:
 *          type: string
 *        required: true
 *        description: The country code
 *    responses:
 *      200:
 *        description: Country deleted successfully.
 *      404:
 *        description: Country not found.
 */

router.delete('/:countryCode', countriesController.deleteCountry);

module.exports = router;
