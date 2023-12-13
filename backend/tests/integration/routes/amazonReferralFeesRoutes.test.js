const request = require('supertest');
const app = require('../../../src/app');
const { initializeDatabase, closeDatabase } = require('../../jest.setup');

describe('AmazonReferralFees API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /amazonReferralFees', () => {
    it('should retrieve a list of Amazon referral fees', async () => {
      const response = await request(app).get('/amazonReferralFees');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /amazonReferralFees/:referralFeeCategoryId', () => {
    it('should retrieve a single Amazon referral fee by ID', async () => {
      const newReferralFee = await createAmazonReferralFee();
      const response = await request(app).get(
        `/amazonReferralFees/${newReferralFee.referralFeeCategoryId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'referralFeeCategoryId',
        newReferralFee.referralFeeCategoryId,
      );
    });
  });

  describe('POST /amazonReferralFees', () => {
    it('should create a new Amazon referral fee', async () => {
      const newReferralFeeData = generateAmazonReferralFeeData();
      const response = await request(app)
        .post('/amazonReferralFees')
        .send(newReferralFeeData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('referralFeeCategoryId');
    });
  });

  describe('PATCH /amazonReferralFees/:referralFeeCategoryId', () => {
    it('should update an existing Amazon referral fee', async () => {
      const newReferralFee = await createAmazonReferralFee();
      const updatedData = {
        referralFeePercentage: 8.0,
        // Add other fields to update
      };

      const response = await request(app)
        .patch(`/amazonReferralFees/${newReferralFee.referralFeeCategoryId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /amazonReferralFees/:referralFeeCategoryId', () => {
    it('should delete an Amazon referral fee', async () => {
      const newReferralFee = await createAmazonReferralFee();

      const deleteResponse = await request(app).delete(
        `/amazonReferralFees/${newReferralFee.referralFeeCategoryId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create an Amazon referral fee
 * @async
 * @function createAmazonReferralFee
 * @return {Promise<Object>} Promise object that represents the created Amazon referral fee
 */
async function createAmazonReferralFee() {
  const newReferralFeeData = generateAmazonReferralFeeData();
  const response = await request(app)
    .post('/amazonReferralFees')
    .send(newReferralFeeData);

  return response.body;
}

/**
 * Helper function to generate Amazon referral fee data
 * @function generateAmazonReferralFeeData
 * @return {Object} Object containing Amazon referral fee data
 */
function generateAmazonReferralFeeData() {
  return {
    countryCode: 'FR',
    referralFeeCategoryNameEn: `Category ${Date.now()}`,
    referralFeePercentage: 0.15,
    perItemMinimumReferralFee: 1.0,
    closingFee: 0.5,
    // Add other required fields as per your schema
  };
}
