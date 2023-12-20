const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('Warehouses API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /warehouses', () => {
    it('should retrieve a list of warehouses', async () => {
      const response = await request(app).get('/warehouses');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      // Additional assertions based on expected data structure
    });
  });

  describe('GET /warehouses/:warehouseId', () => {
    it('should retrieve a single warehouse by ID', async () => {
      // Create a new warehouse to ensure the ID exists
      const newWarehouse = await createWarehouse();
      const response = await request(app).get(
        `/warehouses/${newWarehouse.warehouseId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'warehouseId',
        newWarehouse.warehouseId,
      );
      // Additional assertions as needed
    });
  });

  describe('POST /warehouses', () => {
    it('should create a new warehouse', async () => {
      const newWarehouseData = generateWarehouseData();
      const response = await request(app)
        .post('/warehouses')
        .send(newWarehouseData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('warehouseId');
      // Additional assertions as needed
    });
  });

  describe('PATCH /warehouses/:warehouseId', () => {
    it('should update an existing warehouse', async () => {
      // Create a new warehouse to ensure the ID exists
      const newWarehouse = await createWarehouse();
      const updatedData = {
        warehouseName: 'Updated Name',
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/warehouses/${newWarehouse.warehouseId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      // Additional assertions as needed
    });
  });

  describe('DELETE /warehouses/:warehouseId', () => {
    it('should delete a warehouse', async () => {
      // Create a new warehouse to ensure the ID exists
      const newWarehouse = await createWarehouse();

      const deleteResponse = await request(app).delete(
        `/warehouses/${newWarehouse.warehouseId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
      // Additional assertions as needed
    });
  });
});

/**
 * Helper function to create a warehouse
 * @function createWarehouse
 * @return {Promise<*>} Promise object that represents the created warehouse
 */
async function createWarehouse() {
  const newWarehouseData = generateWarehouseData();
  const response = await request(app)
    .post('/warehouses')
    .send(newWarehouseData);

  return response.body;
}

/**
 * Helper function to generate warehouse data
 * @return {Object} Object containing warehouse data
 */
function generateWarehouseData() {
  return {
    warehouseName: `Test Warehouse ${Date.now()}`, // Using dynamic data to avoid duplicates
    warehouseAddress: '123 Test St',
    warehousePostcode: '12345',
    warehouseCity: 'TestCity',
    warehouseCountry: 'TestCountry',
    warehouseContactName: 'John Doe',
    warehouseContactNumber: '1234567890',
    warehouseContactEmail: `john${Date.now()}@example.com`, // Using dynamic data to avoid duplicates
  };
}
