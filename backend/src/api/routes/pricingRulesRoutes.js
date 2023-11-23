const express = require('express');
const router = express.Router();
const pricingRulesController = require('../controllers/pricingRulesController');

/**
 * @swagger
 * components:
 *  schemas:
 *    PricingRule:
 *      type: object
 *      required:
 *        - pricingRuleName
 *        - pricingRuleMinimumRoi
 *        - pricingRuleMinimumMargin
 *      properties:
 *        pricingRuleId:
 *          type: integer
 *          description: The ID of the pricing rule.
 *        pricingRuleName:
 *          type: string
 *          description: The name of the pricing rule.
 *        pricingRuleDescription:
 *          type: string
 *          description: Description of the pricing rule.
 *        pricingRuleMinimumRoi:
 *          type: number
 *          format: decimal
 *          description: The minimum ROI for the pricing rule.
 *        pricingRuleMinimumMargin:
 *          type: number
 *          format: decimal
 *          description: The minimum margin for the pricing rule.
 * tags:
 *  name: PricingRules
 *  description: Managing pricing rules
 */

/**
 * @swagger
 * /pricingRules:
 *   get:
 *     summary: Retrieve a list of pricing rules
 *     tags: [PricingRules]
 *     responses:
 *       200:
 *         description: A list of pricing rules.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PricingRule'
 */

router.get('/', pricingRulesController.getAllPricingRules);

/**
 * @swagger
 * /pricingRules/{pricingRuleId}:
 *  get:
 *    summary: Get a single pricing rule by ID
 *    tags: [PricingRules]
 *    parameters:
 *      - in: path
 *        name: pricingRuleId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The pricing rule ID
 *    responses:
 *      200:
 *        description: Details of the pricing rule.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PricingRule'
 *      404:
 *        description: Pricing rule not found.
 */

router.get('/:pricingRuleId', pricingRulesController.getPricingRuleById);

/**
 * @swagger
 * /pricingRules:
 *  post:
 *    summary: Create a new pricing rule
 *    tags: [PricingRules]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PricingRule'
 *    responses:
 *      201:
 *        description: Pricing rule created successfully.
 *      400:
 *        description: Invalid input.
 */

router.post('/', pricingRulesController.createPricingRule);

/**
 * @swagger
 * /pricingRules/{pricingRuleId}:
 *   patch:
 *     summary: Partially update an existing pricing rule
 *     tags: [PricingRules]
 *     parameters:
 *       - in: path
 *         name: pricingRuleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the pricing rule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pricingRuleName:
 *                 type: string
 *                 description: The name of the pricing rule.
 *               pricingRuleDescription:
 *                 type: string
 *                 description: Description of the pricing rule.
 *               pricingRuleMinimumRoi:
 *                 type: number
 *                 format: decimal
 *                 description: The minimum ROI for the pricing rule.
 *               pricingRuleMinimumMargin:
 *                 type: number
 *                 format: decimal
 *                 description: The minimum margin for the pricing rule.
 *     responses:
 *       200:
 *         description: Pricing rule updated successfully.
 *       404:
 *         description: Pricing rule not found.
 *       400:
 *         description: Invalid input.
 */

router.patch('/:pricingRuleId', pricingRulesController.updatePricingRule);

/**
 * @swagger
 * /pricingRules/{pricingRuleId}:
 *  delete:
 *    summary: Delete a pricing rule
 *    tags: [PricingRules]
 *    parameters:
 *      - in: path
 *        name: pricingRuleId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The pricing rule ID
 *    responses:
 *      200:
 *        description: Pricing rule deleted successfully.
 *      404:
 *        description: Pricing rule not found.
 */

router.delete('/:pricingRuleId', pricingRulesController.deletePricingRule);

module.exports = router;
