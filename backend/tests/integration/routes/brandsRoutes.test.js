const request = require('supertest');
const app = require('../../../src/app');
const { initializeDatabase, closeDatabase } = require('../../jest.setup');

describe('Brands API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /brands', () => {
    it('should retrieve a list of brands', async () => {
      const response = await request(app).get('/brands');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /brands/:brandId', () => {
    it('should retrieve a single brand by ID', async () => {
      const newBrand = await createBrand();
      const response = await request(app).get(`/brands/${newBrand.brandId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('brandId', newBrand.brandId);
    });
  });

  describe('POST /brands', () => {
    it('should create a new brand', async () => {
      const newBrandData = generateBrandData();
      const response = await request(app).post('/brands').send(newBrandData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('brandId');
    });
  });

  describe('PATCH /brands/:brandId', () => {
    it('should update an existing brand', async () => {
      const newBrand = await createBrand();
      const updatedData = {
        brandName: 'Updated Brand Name',
      };

      const response = await request(app)
        .patch(`/brands/${newBrand.brandId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /brands/:brandId', () => {
    it('should delete a brand', async () => {
      const newBrand = await createBrand();

      const deleteResponse = await request(app).delete(
        `/brands/${newBrand.brandId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a brand
 * @async
 * @function createBrand
 * @return {Promise<Object>} Promise object that represents the created brand
 */
async function createBrand() {
  const newBrandData = generateBrandData();
  const response = await request(app).post('/brands').send(newBrandData);

  return response.body;
}

/**
 * Helper function to generate brand data
 * @function generateBrandData
 * @return {Object} Object containing brand data
 */
function generateBrandData() {
  return {
    brandName: `Brand ${Date.now()}`, // Dynamic name to avoid duplicates
  };
}
