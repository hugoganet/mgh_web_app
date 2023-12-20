const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('ASINs API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /asins', () => {
    it('should retrieve a list of ASINs', async () => {
      const response = await request(app).get('/asins');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /asins/:asinId', () => {
    it('should retrieve a single ASIN by ID', async () => {
      const newAsin = await createAsin();
      const response = await request(app).get(`/asins/${newAsin.asinId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('asinId', newAsin.asinId);
    });
  });

  describe('POST /asins', () => {
    it('should create a new ASIN', async () => {
      const newAsinData = generateAsinData();
      const response = await request(app).post('/asins').send(newAsinData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('asinId');
    });
  });

  describe('PATCH /asins/:asinId', () => {
    it('should update an existing ASIN', async () => {
      const newAsin = await createAsin();
      const updatedData = {
        asinName: 'Updated Asin Name',
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/asins/${newAsin.asinId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /asins/:asinId', () => {
    it('should delete an ASIN', async () => {
      const newAsin = await createAsin();

      const deleteResponse = await request(app).delete(
        `/asins/${newAsin.asinId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create an ASIN
 * @async
 * @function createAsin
 * @return {Promise<Object>} Promise object that represents the created ASIN
 */
async function createAsin() {
  const newAsinData = generateAsinData();
  const response = await request(app).post('/asins').send(newAsinData);

  return response.body;
}

/**
 * Helper function to generate ASIN data
 * @function generateAsinData
 * @return {Object} Object containing ASIN data
 */
function generateAsinData() {
  const asin = Date.now().toString().slice(0, 10);
  return {
    asin: asin,
    countryCode: 'FR',
    productCategoryId: 1,
    productCategoryRankId: 1,
    productTaxCategoryId: 1,
    asinName: 'Test Product',
    asinPotentialWarehousesQuantity: 10,
    asinNumberOfActiveSku: 5,
    asinAverageUnitSoldPerDay: 2.5,
    isBatteryRequired: false,
    isHazmat: false,
  };
}
