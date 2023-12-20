const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('Catalog API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /catalog', () => {
    it('should retrieve a list of catalog entries', async () => {
      const response = await request(app).get('/catalog');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /catalog/:catalogId', () => {
    it('should retrieve a single catalog entry by ID', async () => {
      const newEntry = await createCatalogEntry();
      const response = await request(app).get(`/catalog/${newEntry.catalogId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('catalogId', newEntry.catalogId);
    });
  });

  describe('POST /catalog', () => {
    it('should create a new catalog entry', async () => {
      const newEntryData = generateCatalogEntryData();
      const response = await request(app).post('/catalog').send(newEntryData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('catalogId');
    });
  });

  describe('PATCH /catalog/:catalogId', () => {
    it('should update an existing catalog entry', async () => {
      const newEntry = await createCatalogEntry();
      const updatedData = {
        supplierPartNumber: 'Updated Part Number',
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/catalog/${newEntry.catalogId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /catalog/:catalogId', () => {
    it('should delete a catalog entry', async () => {
      const newEntry = await createCatalogEntry();

      const deleteResponse = await request(app).delete(
        `/catalog/${newEntry.catalogId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a catalog entry
 * @async
 * @function createCatalogEntry
 * @return {Promise<Object>} Promise object that represents the created catalog entry
 */
async function createCatalogEntry() {
  const newEntryData = generateCatalogEntryData();
  const response = await request(app).post('/catalog').send(newEntryData);

  return response.body;
}

/**
 * Helper function to generate catalog entry data
 * @function generateCatalogEntryData
 * @return {Object} Object containing catalog entry data
 */
function generateCatalogEntryData() {
  return {
    ean: '1234567890123', // Replace with a valid EAN
    supplierId: 1, // Use a valid supplier ID
    supplierPartNumber: 'SPN123',
    brandId: 1, // Use a valid brand ID
    unitPackSize: 10,
    productPriceExc: 100.0,
    productVatRate: 0.2,
    catalogEntryLastUpdate: new Date().toISOString(),
  };
}
