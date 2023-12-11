const request = require('supertest');
const app = require('../../../src/app');
const { initializeDatabase, closeDatabase } = require('../../jest.setup');

describe('ProductTaxCategories API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /productTaxCategories', () => {
    it('should retrieve a list of product tax categories', async () => {
      const response = await request(app).get('/productTaxCategories');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /productTaxCategories/:productTaxCategoryId', () => {
    it('should retrieve a single product tax category by ID', async () => {
      const newProductTaxCategory = await createProductTaxCategory();
      const response = await request(app).get(
        `/productTaxCategories/${newProductTaxCategory.productTaxCategoryId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'productTaxCategoryId',
        newProductTaxCategory.productTaxCategoryId,
      );
    });
  });

  describe('POST /productTaxCategories', () => {
    it('should create a new product tax category', async () => {
      const newProductTaxCategoryData = generateProductTaxCategoryData();
      const response = await request(app)
        .post('/productTaxCategories')
        .send(newProductTaxCategoryData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('productTaxCategoryId');
    });
  });

  describe('PATCH /productTaxCategories/:productTaxCategoryId', () => {
    it('should update an existing product tax category', async () => {
      const newProductTaxCategory = await createProductTaxCategory();
      const updatedData = {
        productTaxCategoryName: 'Updated Name',
      };

      const response = await request(app)
        .patch(
          `/productTaxCategories/${newProductTaxCategory.productTaxCategoryId}`,
        )
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /productTaxCategories/:productTaxCategoryId', () => {
    it('should delete a product tax category', async () => {
      const newProductTaxCategory = await createProductTaxCategory();

      const deleteResponse = await request(app).delete(
        `/productTaxCategories/${newProductTaxCategory.productTaxCategoryId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a product tax category
 * @async
 * @function createProductTaxCategory
 * @return {Promise<Object>} Promise object that represents the created product tax category
 */
async function createProductTaxCategory() {
  const newProductTaxCategoryData = generateProductTaxCategoryData();
  const response = await request(app)
    .post('/productTaxCategories')
    .send(newProductTaxCategoryData);

  return response.body;
}

/**
 * Helper function to generate product tax category data
 * @function generateProductTaxCategoryData
 * @return {Object} Object containing product tax category data
 */
function generateProductTaxCategoryData() {
  return {
    countryCode: 'FR',
    productTaxCategoryName: `Tax Category ${Date.now()}`, // Dynamic name to avoid duplicates
    productTaxCategoryDescription: 'Description of the product tax category',
    vatCategoryId: 'S',
  };
}
