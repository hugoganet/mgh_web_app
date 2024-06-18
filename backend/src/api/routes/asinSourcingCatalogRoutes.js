const express = require('express');
const router = express.Router();
const asinSourcingCatalogController = require('../controllers/asinSourcingCatalogController');

/**
 * @swagger
 * components:
 *  schemas:
 *    AsinSourcingCatalog:
 *      type: object
 *      required:
 *        - keepaDataId
 *        - ean
 *      properties:
 *        asinSourcingCatalogId:
 *          type: integer
 *        keepaDataId:
 *          type: integer
 *          description: ID of the Keepa data entry.
 *        ean:
 *          type: string
 *          description: The EAN code.
 *        productCategoryRank:
 *          type: number
 *          format: double
 *        averageSellingPriceInc:
 *          type: number
 *          format: double
 *        estimAsinAcquisitionCostExc:
 *          type: number
 *          format: double
 *        estimAsinAcquisitionCostInc:
 *          type: number
 *          format: double
 *        minimumSellingPriceLocalAndPanEu:
 *          type: number
 *          format: double
 *        minimumSellingPriceEfn:
 *          type: number
 *          format: double
 *        estimMonthlyRevenu:
 *          type: number
 *          format: double
 *        estimMonthlyMarginExc:
 *          type: number
 *          format: double
 *        estimAcquisitionCostExc:
 *          type: number
 *          format: double
 *        estimPersonalMonthlyQuantitySold:
 *          type: integer
 *        pvMoyenConstate:
 *          type: number
 *          format: double
 *        fbaFees:
 *          type: number
 *          format: double
 *        prepFees:
 *          type: number
 *          format: double
 *        transportFees:
 *          type: number
 *          format: double
 *        isHazmat:
 *          type: boolean
 *        estimMonthlyQuantitySold:
 *          type: integer
 *        estimNumberOfSeller:
 *          type: integer
 *        desiredNumberOfWeeksCovered:
 *          type: integer
 * tags:
 *  name: AsinSourcingCatalog
 *  description: The ASIN Sourcing Catalog managing API
 */

/**
 * @swagger
 * /asinsourcingcatalog:
 *   get:
 *     summary: Retrieve a list of ASIN Sourcing Catalog entries
 *     tags: [AsinSourcingCatalog]
 *     responses:
 *       200:
 *         description: A list of ASIN Sourcing Catalog entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsinSourcingCatalog'
 *       400:
 *         description: Invalid input.
 */
router.get('/', asinSourcingCatalogController.getAllAsinSourcingCatalog);

/**
 * @swagger
 * /asinsourcingcatalog/{asinSourcingCatalogId}:
 *  get:
 *    summary: Get a single ASIN Sourcing Catalog entry by ID
 *    tags: [AsinSourcingCatalog]
 *    parameters:
 *      - in: path
 *        name: asinSourcingCatalogId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ASIN Sourcing Catalog ID
 *    responses:
 *      200:
 *        description: Details of the ASIN Sourcing Catalog entry.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AsinSourcingCatalog'
 *      404:
 *        description: ASIN Sourcing Catalog entry not found.
 */

router.get(
  '/:asinSourcingCatalogId',
  asinSourcingCatalogController.getAsinSourcingCatalogById,
);

/**
 * @swagger
 * /asinsourcingcatalog:
 *  post:
 *    summary: Create a new ASIN Sourcing Catalog entry
 *    tags: [AsinSourcingCatalog]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AsinSourcingCatalog'
 *    responses:
 *      201:
 *        description: ASIN Sourcing Catalog entry created successfully.
 *      400:
 *        description: Invalid input.
 */

router.post('/', asinSourcingCatalogController.createAsinSourcingCatalog);

/**
 * @swagger
 * /asinsourcingcatalog/{asinSourcingCatalogId}:
 *   patch:
 *     summary: Partially update an existing ASIN Sourcing Catalog entry
 *     tags: [AsinSourcingCatalog]
 *     parameters:
 *       - in: path
 *         name: asinSourcingCatalogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the ASIN Sourcing Catalog entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keepaDataId:
 *                 type: integer
 *                 description: ID of the Keepa data entry.
 *               ean:
 *                 type: string
 *                 description: The EAN code.
 *               productCategoryRank:
 *                 type: number
 *                 format: double
 *               averageSellingPriceInc:
 *                 type: number
 *                 format: double
 *               estimAsinAcquisitionCostExc:
 *                 type: number
 *                 format: double
 *               estimAsinAcquisitionCostInc:
 *                 type: number
 *                 format: double
 *               minimumSellingPriceLocalAndPanEu:
 *                 type: number
 *                 format: double
 *               minimumSellingPriceEfn:
 *                 type: number
 *                 format: double
 *               estimMonthlyRevenu:
 *                 type: number
 *                 format: double
 *               estimMonthlyMarginExc:
 *                 type: number
 *                 format: double
 *               estimAcquisitionCostExc:
 *                 type: number
 *                 format: double
 *               estimPersonalMonthlyQuantitySold:
 *                 type: integer
 *               pvMoyenConstate:
 *                 type: number
 *                 format: double
 *               fbaFees:
 *                 type: number
 *                 format: double
 *               prepFees:
 *                 type: number
 *                 format: double
 *               transportFees:
 *                 type: number
 *                 format: double
 *               isHazmat:
 *                 type: boolean
 *               estimMonthlyQuantitySold:
 *                 type: integer
 *               estimNumberOfSeller:
 *                 type: integer
 *               desiredNumberOfWeeksCovered:
 *                 type: integer
 *     responses:
 *       200:
 *         description: ASIN Sourcing Catalog entry updated successfully.
 *       404:
 *         description: ASIN Sourcing Catalog entry not found.
 *       400:
 *         description: Invalid input.
 */

router.patch(
  '/:asinSourcingCatalogId',
  asinSourcingCatalogController.updateAsinSourcingCatalog,
);

/**
 * @swagger
 * /asinsourcingcatalog/{asinSourcingCatalogId}:
 *  delete:
 *    summary: Delete an ASIN Sourcing Catalog entry
 *    tags: [AsinSourcingCatalog]
 *    parameters:
 *      - in: path
 *        name: asinSourcingCatalogId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ASIN Sourcing Catalog ID
 *    responses:
 *      200:
 *        description: ASIN Sourcing Catalog entry deleted successfully.
 *      404:
 *        description: ASIN Sourcing Catalog entry not found.
 */

router.delete(
  '/:asinSourcingCatalogId',
  asinSourcingCatalogController.deleteAsinSourcingCatalog,
);

module.exports = router;
