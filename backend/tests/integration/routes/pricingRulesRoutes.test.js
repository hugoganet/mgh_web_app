const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('PricingRules API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /pricingRules', () => {
    it('should retrieve a list of pricing rules', async () => {
      const response = await request(app).get('/pricingRules');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /pricingRules/:pricingRuleId', () => {
    it('should retrieve a single pricing rule by ID', async () => {
      const newPricingRule = await createPricingRule();
      const response = await request(app).get(
        `/pricingRules/${newPricingRule.pricingRuleId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'pricingRuleId',
        newPricingRule.pricingRuleId,
      );
    });
  });

  describe('POST /pricingRules', () => {
    it('should create a new pricing rule', async () => {
      const newPricingRuleData = generatePricingRuleData();
      const response = await request(app)
        .post('/pricingRules')
        .send(newPricingRuleData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('pricingRuleId');
    });
  });

  describe('PATCH /pricingRules/:pricingRuleId', () => {
    it('should update an existing pricing rule', async () => {
      const newPricingRule = await createPricingRule();
      const updatedData = {
        pricingRuleName: 'Updated Rule',
        pricingRuleMinimumRoi: 1.5,
        pricingRuleMinimumMargin: 10,
      };

      const response = await request(app)
        .patch(`/pricingRules/${newPricingRule.pricingRuleId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /pricingRules/:pricingRuleId', () => {
    it('should delete a pricing rule', async () => {
      const newPricingRule = await createPricingRule();

      const deleteResponse = await request(app).delete(
        `/pricingRules/${newPricingRule.pricingRuleId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a pricing rule
 * @async
 * @function createPricingRule
 * @return {Promise<Object>} Promise object that represents the created pricing rule
 */
async function createPricingRule() {
  const newPricingRuleData = generatePricingRuleData();
  const response = await request(app)
    .post('/pricingRules')
    .send(newPricingRuleData);

  return response.body;
}

/**
 * Helper function to generate pricing rule data
 * @function generatePricingRuleData
 * @return {Object} Object containing pricing rule data
 */
function generatePricingRuleData() {
  return {
    pricingRuleName: `Test Rule ${Date.now()}`, // Dynamic data for uniqueness
    pricingRuleDescription: 'A test pricing rule',
    pricingRuleMinimumRoi: 1.0,
    pricingRuleMinimumMargin: 5,
  };
}
