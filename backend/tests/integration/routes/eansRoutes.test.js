const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('EANs API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /eans', () => {
    it('should retrieve a list of EANs with pagination and warehouse stock levels', async () => {
      const response = await request(app).get('/eans');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0]).toHaveProperty('ean');
    });
  });

  describe('GET /eans/:ean', () => {
    it('should retrieve a single EAN by ID, including warehouse stock levels', async () => {
      const newEan = await createEan();
      const response = await request(app).get(`/eans/${newEan.ean}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ean', newEan.ean);
    });
  });

  describe('POST /eans', () => {
    it('should create a new EAN', async () => {
      const newEanData = generateEanData();
      const response = await request(app).post('/eans').send(newEanData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('ean');
    });
  });

  describe('PATCH /eans/:ean', () => {
    it('should update an existing EAN', async () => {
      const newEan = await createEan();
      const updatedData = {
        productName: 'Updated Product Name',
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/eans/${newEan.ean}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /eans/:ean', () => {
    it('should delete an EAN', async () => {
      const newEan = await createEan();

      const deleteResponse = await request(app).delete(`/eans/${newEan.ean}`);
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create an EAN
 * @async
 * @function createEan
 * @return {Promise<Object>} Promise object that represents the created EAN
 */
async function createEan() {
  const newEanData = generateEanData();
  const response = await request(app).post('/eans').send(newEanData);

  return response.body;
}

/**
 * Helper function to generate EAN data
 * @function generateEanData
 * @return {Object} Object containing EAN data
 */
function generateEanData() {
  return {
    ean: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(), // generate a random 13-digit number
    productName: 'Test Product',
    brandId: 1,
  };
}
