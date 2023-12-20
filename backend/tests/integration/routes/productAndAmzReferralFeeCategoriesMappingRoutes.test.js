const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('Product and Amazon Referral Fee Categories Mapping API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /productAndAmzReferralFeeCategories', () => {
    it('should retrieve a list of mappings', async () => {
      const response = await request(app).get(
        '/productAndAmzReferralFeeCategories',
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /productAndAmzReferralFeeCategories/:mappingId', () => {
    it('should retrieve a single mapping by ID', async () => {
      const newMapping = await createMapping();
      const response = await request(app).get(
        `/productAndAmzReferralFeeCategories/${newMapping.productAndAmzReferralFeeCategoryId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'productAndAmzReferralFeeCategoryId',
        newMapping.productAndAmzReferralFeeCategoryId,
      );
    });
  });

  describe('POST /productAndAmzReferralFeeCategories', () => {
    it('should create a new mapping', async () => {
      const newMappingData = generateMappingData();
      const response = await request(app)
        .post('/productAndAmzReferralFeeCategories')
        .send(newMappingData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty(
        'productAndAmzReferralFeeCategoryId',
      );
    });
  });

  describe('PATCH /productAndAmzReferralFeeCategories/:mappingId', () => {
    it('should update an existing mapping', async () => {
      const newMapping = await createMapping();
      const updatedData = {
        productCategoryId: 2,
      };

      const response = await request(app)
        .patch(
          `/productAndAmzReferralFeeCategories/${newMapping.productAndAmzReferralFeeCategoryId}`,
        )
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /productAndAmzReferralFeeCategories/:mappingId', () => {
    it('should delete a mapping', async () => {
      const newMapping = await createMapping();

      const deleteResponse = await request(app).delete(
        `/productAndAmzReferralFeeCategories/${newMapping.productAndAmzReferralFeeCategoryId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a mapping
 * @async
 * @function createMapping
 * @return {Promise<Object>} Promise object that represents the created mapping
 */
async function createMapping() {
  const newMappingData = generateMappingData();
  const response = await request(app)
    .post('/productAndAmzReferralFeeCategories')
    .send(newMappingData);

  return response.body;
}

/**
 * Helper function to generate mapping data
 * @function generateMappingData
 * @return {Object} Object containing mapping data
 */
function generateMappingData() {
  const excludedReferralFeeCategoryIds = [
    7, 29, 60, 82, 113, 135, 166, 188, 219, 241, 272, 294,
  ];

  let randomReferralFeeCategoryId;
  do {
    randomReferralFeeCategoryId = Math.floor(Math.random() * 318) + 1; // random number between 1 and 318
  } while (
    excludedReferralFeeCategoryIds.includes(randomReferralFeeCategoryId)
  );

  return {
    productCategoryId: 1,
    referralFeeCategoryId: randomReferralFeeCategoryId,
  };
}
