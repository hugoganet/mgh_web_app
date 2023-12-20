const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('PriceGridFbaFees API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /priceGridFbaFees', () => {
    it('should retrieve a list of price grid FBA fees', async () => {
      const response = await request(app).get('/priceGridFbaFees');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /priceGridFbaFees/:priceGridFbaFeeId', () => {
    it('should retrieve a single price grid FBA fee by ID', async () => {
      const newPriceGridFbaFee = await createPriceGridFbaFee();
      const response = await request(app).get(
        `/priceGridFbaFees/${newPriceGridFbaFee.priceGridFbaFeeId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'priceGridFbaFeeId',
        newPriceGridFbaFee.priceGridFbaFeeId,
      );
    });
  });

  describe('POST /priceGridFbaFees', () => {
    it('should create a new price grid FBA fee', async () => {
      const newPriceGridFbaFeeData = generatePriceGridFbaFeeData();
      const response = await request(app)
        .post('/priceGridFbaFees')
        .send(newPriceGridFbaFeeData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('priceGridFbaFeeId');
    });
  });

  describe('PATCH /priceGridFbaFees/:priceGridFbaFeeId', () => {
    it('should update an existing price grid FBA fee', async () => {
      const newPriceGridFbaFee = await createPriceGridFbaFee();
      const updatedData = {
        countryCode: 'FR', // or other valid countryCode
        fbaPackageCategoryName: 'Updated Category',
        // other fields to update
      };

      const response = await request(app)
        .patch(`/priceGridFbaFees/${newPriceGridFbaFee.priceGridFbaFeeId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /priceGridFbaFees/:priceGridFbaFeeId', () => {
    it('should delete a price grid FBA fee', async () => {
      const newPriceGridFbaFee = await createPriceGridFbaFee();

      const deleteResponse = await request(app).delete(
        `/priceGridFbaFees/${newPriceGridFbaFee.priceGridFbaFeeId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a price grid FBA fee
 * @async
 * @function createPriceGridFbaFee
 * @return {Promise<Object>} Promise object that represents the created price grid FBA fee
 */
async function createPriceGridFbaFee() {
  const newPriceGridFbaFeeData = generatePriceGridFbaFeeData();
  const response = await request(app)
    .post('/priceGridFbaFees')
    .send(newPriceGridFbaFeeData);

  return response.body;
}

/**
 * Helper function to generate price grid FBA fee data
 * @function generatePriceGridFbaFeeData
 * @return {Object} Object containing price grid FBA fee data
 */
function generatePriceGridFbaFeeData() {
  return {
    countryCode: 'FR',
    fbaPackageCategoryName: 'Standard Package',
    categoryMaxWeight: 5.0,
    categoryMaxLength: 20.0,
    categoryMaxWidth: 10.0,
    categoryMaxHeight: 5.0,
    fbaFeeLocalAndPanEu: 2.5,
    fbaFeeEfn: 3.0,
  };
}
