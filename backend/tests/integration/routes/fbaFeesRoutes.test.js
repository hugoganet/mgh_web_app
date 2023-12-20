const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('FBA Fees API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /fbaFees', () => {
    it('should retrieve a list of FBA fees', async () => {
      const response = await request(app).get('/fbaFees');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /fbaFees/:fbaFeeId', () => {
    it('should retrieve a single FBA fee by ID', async () => {
      const newFee = await createFbaFee();
      const response = await request(app).get(`/fbaFees/${newFee.fbaFeeId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('fbaFeeId', newFee.fbaFeeId);
    });
  });

  describe('POST /fbaFees', () => {
    it('should create a new FBA fee', async () => {
      const newFeeData = await generateFbaFeeData();
      const response = await request(app).post('/fbaFees').send(newFeeData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('fbaFeeId');
    });
  });

  describe('PATCH /fbaFees/:fbaFeeId', () => {
    it('should update an existing FBA fee', async () => {
      const newFee = await createFbaFee();
      const updatedData = {
        packageLength: 25,
      };

      const response = await request(app)
        .patch(`/fbaFees/${newFee.fbaFeeId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /fbaFees/:fbaFeeId', () => {
    it('should delete an FBA fee', async () => {
      const newFee = await createFbaFee();

      const deleteResponse = await request(app).delete(
        `/fbaFees/${newFee.fbaFeeId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to generate ASIN data
 * @function generateAsinData
 * @return {Object} Object containing ASIN data
 */
function generateAsinData() {
  const asin = Date.now().toString().slice(-10); // Ensure unique ASIN
  return {
    asin: asin,
    countryCode: 'FR',
    productCategoryId: 1,
    productCategoryRankId: 1,
    productTaxCategoryId: 1,
    asinName: 'Test Product',
    asinPotentialWarehousesQuantity: 10,
    asinNumberOfActiveSku: 5,
    asinAverageUnitSoldPerDay: 2.5,
    isBatteryRequired: false,
    isHazmat: false,
  };
}

/**
 * Helper function to create an ASIN
 * @async
 * @function createAsin
 * @return {Promise<Object>} Promise object that represents the created ASIN
 */
async function createAsin() {
  try {
    const newAsinData = generateAsinData();
    const response = await request(app).post('/asins').send(newAsinData);

    if (response.statusCode !== 201) {
      throw new Error('Failed to create ASIN');
    }

    return response.body;
  } catch (error) {
    console.error('Error creating ASIN:', error.message);
    throw error;
  }
}

/**
 * Helper function to generate FBA fee data
 * @async
 * @function generateFbaFeeData
 * @return {Promise<Object>} Promise object that represents FBA fee data
 */
async function generateFbaFeeData() {
  try {
    const newAsin = await createAsin();
    const asinId = newAsin.asinId;
    return {
      asinId: asinId,
      packageLength: 20,
      packageWidth: 10,
      packageHeight: 5,
      packageWeight: 2,
      priceGridFbaFeeId: 1,
      enrolledInPanEu: true,
      eligibleForPanEu: true,
      referralFeeCategoryId: 1,
      minimumMarginWanted: 15.0,
      minimumSellingPriceLocalAndPanEu: 100.0,
      minimumSellingPriceEfn: 150.0,
      maximumSellingPriceLocalAndPanEu: 200.0,
      maximumSellingPriceEfn: 250.0,
    };
  } catch (error) {
    console.error('Error generating FBA fee data:', error.message);
    throw error;
  }
}

/**
 * Helper function to create an FBA fee
 * @async
 * @function createFbaFee
 * @return {Promise<Object>} Promise object that represents the created FBA fee
 */
async function createFbaFee() {
  try {
    const newFeeData = await generateFbaFeeData();
    const response = await request(app).post('/fbaFees').send(newFeeData);

    if (response.statusCode !== 201) {
      throw new Error('Failed to create FBA fee');
    }

    return response.body;
  } catch (error) {
    console.error('Error creating FBA fee:', error.message);
    throw error;
  }
}
