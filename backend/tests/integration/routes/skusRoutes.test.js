const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('SKUs API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /skus', () => {
    it('should retrieve a list of SKUs', async () => {
      const response = await request(app).get('/skus');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /skus/:skuId', () => {
    it('should retrieve a single SKU by ID', async () => {
      const newSku = await createSku();
      const response = await request(app).get(`/skus/${newSku.skuId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('skuId', newSku.skuId);
    });
  });

  describe('POST /skus', () => {
    it('should create a new SKU', async () => {
      const newSkuData = generateSkuData();
      const response = await request(app).post('/skus').send(newSkuData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('skuId');
    });
  });

  describe('PATCH /skus/:skuId', () => {
    it('should update an existing SKU', async () => {
      const newSku = await createSku();
      const updatedData = {
        skuAcquisitionCostExc: 20.0,
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/skus/${newSku.skuId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /skus/:skuId', () => {
    it('should delete a SKU', async () => {
      const newSku = await createSku();

      const deleteResponse = await request(app).delete(`/skus/${newSku.skuId}`);
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a SKU
 * @async
 * @function createSku
 * @return {Promise<Object>} Promise object that represents the created SKU
 */
async function createSku() {
  const newSkuData = generateSkuData();
  const response = await request(app).post('/skus').send(newSkuData);

  return response.body;
}

/**
 * Helper function to generate SKU data
 * @function generateSkuData
 * @return {Object} Object containing SKU data
 */
function generateSkuData() {
  return {
    sku: `SKU${Date.now()}`,
    countryCode: 'FR',
    skuAcquisitionCostExc: 10.0,
    skuAcquisitionCostInc: 12.0,
    skuAfnTotalQuantity: 100,
    numberOfUnitSold: 50,
  };
}
