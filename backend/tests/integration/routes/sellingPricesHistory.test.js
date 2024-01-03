const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('SellingPricesHistory API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /sellingPricesHistory', () => {
    it('should retrieve a list of selling prices history', async () => {
      const response = await request(app).get('/sellingPricesHistory');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /sellingPricesHistory/:skuId/:date', () => {
    it('should retrieve a single selling price history by SKU ID and date', async () => {
      const newPriceHistory = await createSellingPriceHistory();
      const response = await request(app).get(
        `/sellingPricesHistory/${newPriceHistory.skuId}/${newPriceHistory.date}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('skuId', newPriceHistory.skuId);
    });
  });

  describe('POST /sellingPricesHistory', () => {
    it('should create a new selling price history', async () => {
      const newPriceHistoryData = generateSellingPriceHistoryData();
      const response = await request(app)
        .post('/sellingPricesHistory')
        .send(newPriceHistoryData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('skuId');
    });
  });

  describe('PATCH /sellingPricesHistory/:skuId/:date', () => {
    it('should update an existing selling price history', async () => {
      const newPriceHistory = await createSellingPriceHistory();
      const updatedData = {
        dailyPrice: 15.99,
        // Include other fields to update
      };

      const response = await request(app)
        .patch(
          `/sellingPricesHistory/${newPriceHistory.skuId}/${newPriceHistory.date}`,
        )
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /sellingPricesHistory/:skuId/:date', () => {
    it('should delete a selling price history', async () => {
      const newPriceHistory = await createSellingPriceHistory();

      const deleteResponse = await request(app).delete(
        `/sellingPricesHistory/${newPriceHistory.skuId}/${newPriceHistory.date}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a selling price history
 * @async
 * @function createSellingPriceHistory
 * @return {Promise<Object>} Promise object that represents the created selling price history
 */
async function createSellingPriceHistory() {
  const newPriceHistoryData = generateSellingPriceHistoryData();
  const response = await request(app)
    .post('/sellingPricesHistory')
    .send(newPriceHistoryData);

  return response.body;
}

/**
 * Helper function to generate selling price history data
 * @function generateSellingPriceHistoryData
 * @return {Object} Object containing selling price history data
 */
function generateSellingPriceHistoryData() {
  return {
    skuId: 1, // you will need to adjust these values based on a valid SKU you have
    dailyPrice: 10.99,
    currencyCode: 'USD',
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
  };
}
