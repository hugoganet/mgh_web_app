const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('ProductCategoriesRanks API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /productCategoriesRanks', () => {
    it('should retrieve a list of product category ranks', async () => {
      const response = await request(app).get('/productCategoriesRanks');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /productCategoriesRanks/:productCategoryRankId', () => {
    it('should retrieve a single product category rank by ID', async () => {
      const newRank = await createProductCategoryRank();
      const response = await request(app).get(
        `/productCategoriesRanks/${newRank.productCategoryRankId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'productCategoryRankId',
        newRank.productCategoryRankId,
      );
    });
  });

  describe('POST /productCategoriesRanks', () => {
    it('should create a new product category rank', async () => {
      const newRankData = generateProductCategoryRankData();
      const response = await request(app)
        .post('/productCategoriesRanks')
        .send(newRankData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('productCategoryRankId');
    });
  });

  describe('PATCH /productCategoriesRanks/:productCategoryRankId', () => {
    it('should update an existing product category rank', async () => {
      const newRank = await createProductCategoryRank();
      const updatedData = {
        rankingThreshold: 100,
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/productCategoriesRanks/${newRank.productCategoryRankId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /productCategoriesRanks/:productCategoryRankId', () => {
    it('should delete a product category rank', async () => {
      const newRank = await createProductCategoryRank();

      const deleteResponse = await request(app).delete(
        `/productCategoriesRanks/${newRank.productCategoryRankId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a product category rank
 * @async
 * @function createProductCategoryRank
 * @return {Promise<Object>} Promise object that represents the created product category rank
 */
async function createProductCategoryRank() {
  const newRankData = generateProductCategoryRankData();
  const response = await request(app)
    .post('/productCategoriesRanks')
    .send(newRankData);

  return response.body;
}

/**
 * Helper function to generate product category rank data
 * @function generateProductCategoryRankData
 * @return {Object} Object containing product category rank data
 */
function generateProductCategoryRankData() {
  return {
    countryCode: 'FR',
    productCategoryId: 1,
    rankingThreshold: 50,
    rankingThresholdPercentage: 0.1,
  };
}
