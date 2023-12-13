const request = require('supertest');
const app = require('../../../src/app'); // Adjust the path as needed
const { initializeDatabase, closeDatabase } = require('../../jest.setup');

describe('Suppliers API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /suppliers', () => {
    it('should retrieve a list of suppliers', async () => {
      const response = await request(app).get('/suppliers');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /suppliers/:supplierId', () => {
    it('should retrieve a single supplier by ID', async () => {
      const newSupplier = await createSupplier();
      const response = await request(app).get(
        `/suppliers/${newSupplier.supplierId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'supplierId',
        newSupplier.supplierId,
      );
    });
  });

  describe('POST /suppliers', () => {
    it('should create a new supplier', async () => {
      const newSupplierData = generateSupplierData();
      const response = await request(app)
        .post('/suppliers')
        .send(newSupplierData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('supplierId');
    });
  });

  describe('PATCH /suppliers/:supplierId', () => {
    it('should update an existing supplier', async () => {
      const newSupplier = await createSupplier();
      const updatedData = {
        supplierName: 'Updated Supplier Name',
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/suppliers/${newSupplier.supplierId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /suppliers/:supplierId', () => {
    it('should delete a supplier', async () => {
      const newSupplier = await createSupplier();

      const deleteResponse = await request(app).delete(
        `/suppliers/${newSupplier.supplierId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a supplier
 * @async
 * @function createSupplier
 * @return {Promise<Object>} Promise object that represents the created supplier
 */
async function createSupplier() {
  const newSupplierData = generateSupplierData();
  const response = await request(app).post('/suppliers').send(newSupplierData);

  return response.body;
}

/**
 * Helper function to generate supplier data
 * @function generateSupplierData
 * @return {Object} Object containing supplier data
 */
function generateSupplierData() {
  return {
    supplierName: `Supplier ${Date.now()}`,
    productCategoryId: 1,
  };
}
