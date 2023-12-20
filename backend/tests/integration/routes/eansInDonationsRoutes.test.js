const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('EANs In Donations API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /eansInDonations', () => {
    it('should retrieve a list of EANs in donations', async () => {
      const response = await request(app).get('/eansInDonations');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /eansInDonations/:eanInDonationId', () => {
    it('should retrieve a single EAN in donation by ID', async () => {
      // Assuming you have a helper function to create a test EAN in donation
      const newEanInDonation = await createEansInDonationsEntry();
      const response = await request(app).get(
        `/eansInDonations/${newEanInDonation.eanInDonationId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'eanInDonationId',
        newEanInDonation.eanInDonationId,
      );
    });
  });

  describe('POST /eansInDonations', () => {
    it('should create a new EAN in donation', async () => {
      const newEanInDonationData = await generateEanInDonationData();
      const response = await request(app)
        .post('/eansInDonations')
        .send(newEanInDonationData);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('eanInDonationId');
    });
  });

  describe('PATCH /eansInDonations/:eanInDonationId', () => {
    it('should update an existing EAN in donation', async () => {
      const newEanInDonation = await createEansInDonationsEntry();
      const updatedData = {
        eanDonationQuantity: 20,
      };
      const response = await request(app)
        .patch(`/eansInDonations/${newEanInDonation.eanInDonationId}`)
        .send(updatedData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /eansInDonations/:eanInDonationId', () => {
    it('should delete an EAN in donation', async () => {
      const newEanInDonation = await createEansInDonationsEntry();
      const deleteResponse = await request(app).delete(
        `/eansInDonations/${newEanInDonation.eanInDonationId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to generate EAN in donation data
 * @function generateEanInDonationData
 * @return {Object} Object containing EAN in donation data
 */
async function generateEanInDonationData() {
  try {
    const newEan = await createEan();
    return {
      ean: newEan.ean,
      donationId: 1,
      eanDonationQuantity: 10, // Sample quantity
    };
  } catch (error) {
    console.error('Error in generateEanInDonationData:', error);
    throw error;
  }
}

/**
 * Helper function to create an EAN in donation entry
 * @async
 * @function createEansInDonationsEntry
 * @return {Promise<Object>} Promise object that represents the created EAN in donation
 */
async function createEansInDonationsEntry() {
  try {
    const newEanInDonationData = await generateEanInDonationData();
    const response = await request(app)
      .post('/eansInDonations')
      .send(newEanInDonationData);

    if (response.statusCode !== 201) {
      throw new Error('Failed to create EAN in donation');
    }

    return response.body;
  } catch (error) {
    console.error('Error in createEansInDonationsEntry:', error);
    throw error;
  }
}

/**
 * Helper function to create an EAN
 * @async
 * @function createEan
 * @return {Promise<Object>} Promise object that represents the created EAN
 */
async function createEan() {
  try {
    const newEanData = generateEanData();
    const response = await request(app).post('/eans').send(newEanData);
    return response.body;
  } catch (error) {
    console.error('Error in createEan:', error);
    throw error;
  }
}

/**
 * Helper function to generate EAN data
 * @function generateEanData
 * @return {Object} Object containing EAN data
 */
function generateEanData() {
  return {
    ean: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
    productName: 'Test Product',
    brandId: 1,
  };
}
