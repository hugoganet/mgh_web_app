const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('VatRatesPerCountry API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /vatRatesPerCountry', () => {
    it('should retrieve a list of VAT rates per country', async () => {
      const response = await request(app).get('/vatRatesPerCountry');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /vatRatesPerCountry/:vatRatePerCountryId', () => {
    it('should retrieve a single VAT rate per country by ID', async () => {
      const newVatRatePerCountry = await createVatRatePerCountry();
      const response = await request(app).get(
        `/vatRatesPerCountry/${newVatRatePerCountry.vatRatePerCountryId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'vatRatePerCountryId',
        newVatRatePerCountry.vatRatePerCountryId,
      );
    });
  });

  describe('POST /vatRatesPerCountry', () => {
    it('should create a new VAT rate per country', async () => {
      const newVatRatePerCountryData = generateVatRatePerCountryData();
      const response = await request(app)
        .post('/vatRatesPerCountry')
        .send(newVatRatePerCountryData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('vatRatePerCountryId');
    });
  });

  describe('PATCH /vatRatesPerCountry/:vatRatePerCountryId', () => {
    it('should update an existing VAT rate per country', async () => {
      const newVatRatePerCountry = await createVatRatePerCountry();
      const updatedData = {
        countryCode: 'FR',
        vatCategoryId: 'Z',
      };

      const response = await request(app)
        .patch(
          `/vatRatesPerCountry/${newVatRatePerCountry.vatRatePerCountryId}`,
        )
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /vatRatesPerCountry/:vatRatePerCountryId', () => {
    it('should delete a VAT rate per country', async () => {
      const newVatRatePerCountry = await createVatRatePerCountry();

      const deleteResponse = await request(app).delete(
        `/vatRatesPerCountry/${newVatRatePerCountry.vatRatePerCountryId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a VAT rate per country
 * @async
 * @function createVatRatePerCountry
 * @return {Promise<Object>} Promise object that represents the created VAT rate per country
 */
async function createVatRatePerCountry() {
  const newVatRatePerCountryData = generateVatRatePerCountryData();
  const response = await request(app)
    .post('/vatRatesPerCountry')
    .send(newVatRatePerCountryData);

  return response.body;
}

/**
 * Helper function to generate VAT rate per country data
 * @function generateVatRatePerCountryData
 * @return {Object} Object containing VAT rate per country data
 */
function generateVatRatePerCountryData() {
  return {
    countryCode: 'FR',
    vatCategoryId: 'S',
    vatRate: 0.2,
  };
}
