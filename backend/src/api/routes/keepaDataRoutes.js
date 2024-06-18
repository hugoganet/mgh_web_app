const express = require('express');
const router = express.Router();
const keepaDataController = require('../controllers/keepaDataController');

/**
 * @swagger
 * components:
 *  schemas:
 *    KeepaData:
 *      type: object
 *      required:
 *        - asin
 *        - countryCode
 *      properties:
 *        keepaDataId:
 *          type: integer
 *        countryCode:
 *          type: string
 *          description: The country code.
 *        asin:
 *          type: string
 *          description: The ASIN code.
 *        urlImage:
 *          type: string
 *          description: The URL of the product image.
 *        ean:
 *          type: string
 *          description: The EAN code.
 *        brand:
 *          type: string
 *          description: The brand of the product.
 *        productName:
 *          type: string
 *          description: The name of the product.
 *        productCategoryId:
 *          type: integer
 *          description: The ID of the product category.
 *        salesRanking30DaysAvg:
 *          type: integer
 *        salesRanking90DaysAvg:
 *          type: integer
 *        salesRanking180DaysAvg:
 *          type: integer
 *        reviewsRating:
 *          type: number
 *          format: double
 *        reviewsCount:
 *          type: integer
 *        amazonCurrent:
 *          type: number
 *          format: double
 *        amazon30DaysAvg:
 *          type: number
 *          format: double
 *        amazon90DaysAvg:
 *          type: number
 *          format: double
 *        amazon180DaysAvg:
 *          type: number
 *          format: double
 *        amazonLowest:
 *          type: number
 *          format: double
 *        amazonHighest:
 *          type: number
 *          format: double
 *        amazon90DaysOOS:
 *          type: number
 *          format: double
 *        newCurrent:
 *          type: number
 *          format: double
 *        new30DaysAvg:
 *          type: number
 *          format: double
 *        new90DaysAvg:
 *          type: number
 *          format: double
 *        new180DaysAvg:
 *          type: number
 *          format: double
 *        newThirdPartyFBACurrent:
 *          type: number
 *          format: double
 *        newThirdPartyFBA30DaysAvg:
 *          type: number
 *          format: double
 *        newThirdPartyFBA90DaysAvg:
 *          type: number
 *          format: double
 *        newThirdPartyFBA180DaysAvg:
 *          type: number
 *          format: double
 *        newThirdPartyFBALowest:
 *          type: number
 *          format: double
 *        fbaPickPackFee:
 *          type: number
 *          format: double
 *        newThirdPartyFBMCurrent:
 *          type: number
 *          format: double
 *        newThirdPartyFBM30DaysAvg:
 *          type: number
 *          format: double
 *        newThirdPartyFBM90DaysAvg:
 *          type: number
 *          format: double
 *        newThirdPartyFBM180DaysAvg:
 *          type: number
 *          format: double
 *        newOffersCurrentCount:
 *          type: integer
 *        newOffers90DaysAvgCount:
 *          type: integer
 *        countRetrievedLiveOffersNewFBA:
 *          type: integer
 *        countRetrievedLiveOffersNewFBM:
 *          type: integer
 *        buyBoxCurrent:
 *          type: number
 *          format: double
 *        buyBox30DaysAvg:
 *          type: number
 *          format: double
 *        buyBox90DaysAvg:
 *          type: number
 *          format: double
 *        buyBox180DaysAvg:
 *          type: number
 *          format: double
 *        buyBoxLowest:
 *          type: number
 *          format: double
 *        buyBoxHighest:
 *          type: number
 *          format: double
 *        buyBoxSeller:
 *          type: string
 *        buyBoxIsFBA:
 *          type: boolean
 *        buyBoxUnqualified:
 *          type: boolean
 *        urlAmazon:
 *          type: string
 *        urlKeepa:
 *          type: string
 *        categoriesSub:
 *          type: string
 *        numberOfItems:
 *          type: integer
 *        packageLengthCm:
 *          type: integer
 *        packageWidthCm:
 *          type: integer
 *        packageHeightCm:
 *          type: integer
 *        packageWeightG:
 *          type: integer
 *        isHazmat:
 *          type: boolean
 * tags:
 *  name: KeepaData
 *  description: The Keepa data managing API
 */

/**
 * @swagger
 * /keepadata:
 *   get:
 *     summary: Retrieve a list of Keepa data
 *     tags: [KeepaData]
 *     responses:
 *       200:
 *         description: A list of Keepa data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KeepaData'
 *       400:
 *         description: Invalid input.
 */
router.get('/', keepaDataController.getAllKeepaData);

/**
 * @swagger
 * /keepadata/{keepaDataId}:
 *  get:
 *    summary: Get a single Keepa data entry by ID
 *    tags: [KeepaData]
 *    parameters:
 *      - in: path
 *        name: keepaDataId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The Keepa data ID
 *    responses:
 *      200:
 *        description: Details of the Keepa data.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/KeepaData'
 *      404:
 *        description: Keepa data not found.
 */

router.get('/:keepaDataId', keepaDataController.getKeepaDataById);

/**
 * @swagger
 * /keepadata:
 *  post:
 *    summary: Create a new Keepa data entry
 *    tags: [KeepaData]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/KeepaData'
 *    responses:
 *      201:
 *        description: Keepa data created successfully.
 *      400:
 *        description: Invalid input.
 */

router.post('/', keepaDataController.createKeepaData);

/**
 * @swagger
 * /keepadata/{keepaDataId}:
 *   patch:
 *     summary: Partially update an existing Keepa data entry
 *     tags: [KeepaData]
 *     parameters:
 *       - in: path
 *         name: keepaDataId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Keepa data to update
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
 *               asin:
 *                 type: string
 *                 description: The ASIN code.
 *               urlImage:
 *                 type: string
 *                 description: The URL of the product image.
 *               ean:
 *                 type: string
 *                 description: The EAN code.
 *               brand:
 *                 type: string
 *                 description: The brand of the product.
 *               productName:
 *                 type: string
 *                 description: The name of the product.
 *               productCategoryId:
 *                 type: integer
 *                 description: The ID of the product category.
 *               salesRanking30DaysAvg:
 *                 type: integer
 *               salesRanking90DaysAvg:
 *                 type: integer
 *               salesRanking180DaysAvg:
 *                 type: integer
 *               reviewsRating:
 *                 type: number
 *                 format: double
 *               reviewsCount:
 *                 type: integer
 *               amazonCurrent:
 *                 type: number
 *                 format: double
 *               amazon30DaysAvg:
 *                 type: number
 *                 format: double
 *               amazon90DaysAvg:
 *                 type: number
 *                 format: double
 *               amazon180DaysAvg:
 *                 type: number
 *                 format: double
 *               amazonLowest:
 *                 type: number
 *                 format: double
 *               amazonHighest:
 *                 type: number
 *                 format: double
 *               amazon90DaysOOS:
 *                 type: number
 *                 format: double
 *               newCurrent:
 *                 type: number
 *                 format: double
 *               new30DaysAvg:
 *                 type: number
 *                 format: double
 *               new90DaysAvg:
 *                 type: number
 *                 format: double
 *               new180DaysAvg:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBACurrent:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBA30DaysAvg:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBA90DaysAvg:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBA180DaysAvg:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBALowest:
 *                 type: number
 *                 format: double
 *               fbaPickPackFee:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBMCurrent:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBM30DaysAvg:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBM90DaysAvg:
 *                 type: number
 *                 format: double
 *               newThirdPartyFBM180DaysAvg:
 *                 type: number
 *                 format: double
 *               newOffersCurrentCount:
 *                 type: integer
 *               newOffers90DaysAvgCount:
 *                 type: integer
 *               countRetrievedLiveOffersNewFBA:
 *                 type: integer
 *               countRetrievedLiveOffersNewFBM:
 *                 type: integer
 *               buyBoxCurrent:
 *                 type: number
 *                 format: double
 *               buyBox30DaysAvg:
 *                 type: number
 *                 format: double
 *               buyBox90DaysAvg:
 *                 type: number
 *                 format: double
 *               buyBox180DaysAvg:
 *                 type: number
 *                 format: double
 *               buyBoxLowest:
 *                 type: number
 *                 format: double
 *               buyBoxHighest:
 *                 type: number
 *                 format: double
 *               buyBoxSeller:
 *                 type: string
 *               buyBoxIsFBA:
 *                 type: boolean
 *               buyBoxUnqualified:
 *                 type: boolean
 *               urlAmazon:
 *                 type: string
 *               urlKeepa:
 *                 type: string
 *               categoriesSub:
 *                 type: string
 *               numberOfItems:
 *                 type: integer
 *               packageLengthCm:
 *                 type: integer
 *               packageWidthCm:
 *                 type: integer
 *               packageHeightCm:
 *                 type: integer
 *               packageWeightG:
 *                 type: integer
 *               isHazmat:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Keepa data updated successfully.
 *       404:
 *         description: Keepa data not found.
 *       400:
 *         description: Invalid input.
 */

router.patch('/:keepaDataId', keepaDataController.updateKeepaData);

/**
 * @swagger
 * /keepadata/{keepaDataId}:
 *  delete:
 *    summary: Delete a Keepa data entry
 *    tags: [KeepaData]
 *    parameters:
 *      - in: path
 *        name: keepaDataId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The Keepa data ID
 *    responses:
 *      200:
 *        description: Keepa data deleted successfully.
 *      404:
 *        description: Keepa data not found.
 */

router.delete('/:keepaDataId', keepaDataController.deleteKeepaData);

module.exports = router;
