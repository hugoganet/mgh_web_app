const request = require('supertest');
const app = require('../../../src/app');
const { initializeDatabase, closeDatabase } = require('../../jest.setup');

describe('Minimum Selling Prices API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /minimumSellingPrices', () => {
    it('should retrieve a list of minimum selling prices', async () => {
      const response = await request(app).get('/minimumSellingPrices');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /minimumSellingPrices/:minimumSellingPriceId', () => {
    it('should retrieve a single minimum selling price by ID', async () => {
      const newPrice = await createMinimumSellingPrice();
      const response = await request(app).get(
        `/minimumSellingPrices/${newPrice.minimumSellingPriceId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'minimumSellingPriceId',
        newPrice.minimumSellingPriceId,
      );
    });
  });

  describe('POST /minimumSellingPrices', () => {
    it('should create a new minimum selling price', async () => {
      const newPriceData = generateMinimumSellingPriceData();
      const response = await request(app)
        .post('/minimumSellingPrices')
        .send(newPriceData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('minimumSellingPriceId');
    });
  });

  describe('PATCH /minimumSellingPrices/:minimumSellingPriceId', () => {
    it('should update an existing minimum selling price', async () => {
      const newPrice = await createMinimumSellingPrice();
      const updatedData = {
        minimumMarginWanted: 20.0, // Example update
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/minimumSellingPrices/${newPrice.minimumSellingPriceId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /minimumSellingPrices/:minimumSellingPriceId', () => {
    it('should delete a minimum selling price', async () => {
      const newPrice = await createMinimumSellingPrice();

      const deleteResponse = await request(app).delete(
        `/minimumSellingPrices/${newPrice.minimumSellingPriceId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a minimum selling price
 * @async
 * @function createMinimumSellingPrice
 * @return {Promise<Object>} Promise object that represents the created minimum selling price
 */
async function createMinimumSellingPrice() {
  const newPriceData = generateMinimumSellingPriceData();
  const response = await request(app)
    .post('/minimumSellingPrices')
    .send(newPriceData);

  return response.body;
}

/**
 * Helper function to generate minimum selling price data
 * @function generateMinimumSellingPriceData
 * @return {Object} Object containing minimum selling price data
 */
function generateMinimumSellingPriceData() {
  const skuId = Math.floor(Math.random() * 2000) + 1; // generate random SKU ID between 1 and 2000 (skuId exist but not used in miinimumSellingPrices table)
  return {
    skuId: skuId,
    pricingRuleId: 1,
    enrolledInPanEu: true,
    eligibleForPanEu: true,
    referralFeeCategoryId: 1,
    minimumMarginWanted: 15.0,
    minimumSellingPriceLocalAndPanEu: 100.0,
    minimumSellingPriceEfn: 120.0,
    maximumSellingPriceLocalAndPanEu: 200.0,
    maximumSellingPriceEfn: 220.0,
  };
}
