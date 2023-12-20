const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('ASIN Warehouse Quantity API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /asinwarehousequantity', () => {
    it('should retrieve a list of ASIN warehouse quantities', async () => {
      const response = await request(app).get('/asinwarehousequantity');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /asinwarehousequantity/:asinId', () => {
    it('should retrieve a single ASIN warehouse quantity by ID', async () => {
      const asinId = 2886;
      const response = await request(app).get(
        `/asinwarehousequantity/${asinId}`,
      );
      expect(response.body.totalWarehouseQuantity).toBe(19);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('asinId', asinId);
    });
  });
});
