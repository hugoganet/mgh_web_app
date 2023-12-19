const request = require('supertest');
const app = require('../../../src/app');
const { initializeDatabase, closeDatabase } = require('../../jest.setup');

describe('Countries API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /countries', () => {
    it('should retrieve a list of countries', async () => {
      const response = await request(app).get('/countries');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /countries/:countryCode', () => {
    it('should retrieve a single country by its code', async () => {
      const newCountry = await createCountry();
      const response = await request(app).get(
        `/countries/${newCountry.countryCode}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'countryCode',
        newCountry.countryCode,
      );
    });
  });

  describe('POST /countries', () => {
    it('should create a new country', async () => {
      const newCountryData = generateCountryData();
      const response = await request(app)
        .post('/countries')
        .send(newCountryData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('countryCode');
    });
  });

  describe('PATCH /countries/:countryCode', () => {
    it('should update an existing country', async () => {
      const newCountry = await createCountry();
      const updatedData = {
        countryName: 'Updated Country Name',
      };

      const response = await request(app)
        .patch(`/countries/${newCountry.countryCode}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /countries/:countryCode', () => {
    it('should delete a country', async () => {
      const newCountry = await createCountry();

      const deleteResponse = await request(app).delete(
        `/countries/${newCountry.countryCode}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a country
 * @function createCountry
 * @return {Promise<*>} Promise object that represents the created country
 */
async function createCountry() {
  const newCountryData = generateCountryData();
  const response = await request(app).post('/countries').send(newCountryData);

  return response.body;
}

/**
 * Helper function to generate country data
 * @return {Object} Object containing country data
 */
function generateCountryData() {
  // Generate a random character (A-Z)
  const randomChar = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26));

  // Combine two random characters with the current timestamp, and take the last 2 characters
  const countryCode = (
    randomChar() +
    Date.now().toString() +
    randomChar()
  ).slice(-2);

  return {
    countryCode: countryCode,
    countryName: `Test Country ${Date.now()}`,
  };
}
