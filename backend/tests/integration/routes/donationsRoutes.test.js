const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('Donations API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /donations', () => {
    it('should retrieve a list of donations', async () => {
      const response = await request(app).get('/donations');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /donations/:donationId', () => {
    it('should retrieve a single donation by ID', async () => {
      const newDonation = await createDonation();
      const response = await request(app).get(
        `/donations/${newDonation.donationId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'donationId',
        newDonation.donationId,
      );
    });
  });

  describe('POST /donations', () => {
    it('should create a new donation', async () => {
      const newDonationData = generateDonationData();
      const response = await request(app)
        .post('/donations')
        .send(newDonationData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('donationId');
    });
  });

  describe('PATCH /donations/:donationId', () => {
    it('should update an existing donation', async () => {
      const newDonation = await createDonation();
      const updatedData = {
        donationTo: 'Updated Recipient',
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/donations/${newDonation.donationId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /donations/:donationId', () => {
    it('should delete a donation', async () => {
      const newDonation = await createDonation();

      const deleteResponse = await request(app).delete(
        `/donations/${newDonation.donationId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a donation
 * @async
 * @function createDonation
 * @return {Promise<Object>} Promise object that represents the created donation
 */
async function createDonation() {
  const newDonationData = generateDonationData();
  const response = await request(app).post('/donations').send(newDonationData);

  return response.body;
}

/**
 * Helper function to generate donation data
 * @function generateDonationData
 * @return {Object} Object containing donation data
 */
function generateDonationData() {
  return {
    warehouseId: 1,
    donationTo: 'Test Charity',
    donationDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
  };
}
