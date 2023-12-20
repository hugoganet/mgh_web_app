const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('ProductCategories API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /productCategories', () => {
    it('should retrieve a list of product categories', async () => {
      const response = await request(app).get('/productCategories');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /productCategories/:productCategoryId', () => {
    it('should retrieve a single product category by ID', async () => {
      const newProductCategory = await createProductCategory();
      const response = await request(app).get(
        `/productCategories/${newProductCategory.productCategoryId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'productCategoryId',
        newProductCategory.productCategoryId,
      );
    });
  });

  describe('POST /productCategories', () => {
    it('should create a new product category', async () => {
      const newProductCategoryData = generateProductCategoryData();
      const response = await request(app)
        .post('/productCategories')
        .send(newProductCategoryData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('productCategoryId');
    });
  });

  describe('PATCH /productCategories/:productCategoryId', () => {
    it('should update an existing product category', async () => {
      const newProductCategory = await createProductCategory();
      const updatedData = {
        productCategoryNameEn: 'Updated Name',
        // Add other fields to update
      };

      const response = await request(app)
        .patch(`/productCategories/${newProductCategory.productCategoryId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /productCategories/:productCategoryId', () => {
    it('should delete a product category', async () => {
      const newProductCategory = await createProductCategory();

      const deleteResponse = await request(app).delete(
        `/productCategories/${newProductCategory.productCategoryId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a product category
 * @async
 * @function createProductCategory
 * @return {Promise<Object>} Promise object that represents the created product category
 */
async function createProductCategory() {
  const newProductCategoryData = generateProductCategoryData();
  const response = await request(app)
    .post('/productCategories')
    .send(newProductCategoryData);

  return response.body;
}

/**
 * Helper function to generate product category data
 * @function generateProductCategoryData
 * @return {Object} Object containing product category data
 */
function generateProductCategoryData() {
  return {
    productCategoryNameEn: `Category ${Date.now()}`,
    productCategoryNameFr: `Categorie ${Date.now()}`,
    productCategoryNameDe: `Kategorie ${Date.now()}`,
    productCategoryNameEs: `Categoría ${Date.now()}`,
    productCategoryNameIt: `Categoria ${Date.now()}`,
  };
}
