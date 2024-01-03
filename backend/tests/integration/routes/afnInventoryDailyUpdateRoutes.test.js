const request = require('supertest');
const app = require('../../../src/app'); // Adjust the path based on your directory structure
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup'); // Adjust the path based on your directory structure

describe('AfnInventoryDailyUpdates API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /afnInventoryDailyUpdates', () => {
    it('should retrieve a list of Amazon FBA Inventory Daily Updates', async () => {
      const response = await request(app).get('/afnInventoryDailyUpdates');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /afnInventoryDailyUpdates/:afnInventoryDailyUpdateId', () => {
    it('should retrieve a single Amazon FBA Inventory Daily Update by ID', async () => {
      const newInventoryUpdate = await createAfnInventoryDailyUpdate();
      const response = await request(app).get(
        `/afnInventoryDailyUpdates/${newInventoryUpdate.afnInventoryDailyUpdateId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'afnInventoryDailyUpdateId',
        newInventoryUpdate.afnInventoryDailyUpdateId,
      );
    });
  });

  describe('POST /afnInventoryDailyUpdates', () => {
    it('should create a new Amazon FBA Inventory Daily Update', async () => {
      const newInventoryUpdateData = generateAfnInventoryDailyUpdateData();
      const response = await request(app)
        .post('/afnInventoryDailyUpdates')
        .send(newInventoryUpdateData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('afnInventoryDailyUpdateId');
    });
  });

  describe('PATCH /afnInventoryDailyUpdates/:afnInventoryDailyUpdateId', () => {
    it('should update an existing Amazon FBA Inventory Daily Update', async () => {
      const newInventoryUpdate = await createAfnInventoryDailyUpdate();
      const updatedData = {
        actualPrice: 200.0, // Sample updated price
        // Add other fields to update as needed
      };

      const response = await request(app)
        .patch(
          `/afnInventoryDailyUpdates/${newInventoryUpdate.afnInventoryDailyUpdateId}`,
        )
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /afnInventoryDailyUpdates/:afnInventoryDailyUpdateId', () => {
    it('should delete an Amazon FBA Inventory Daily Update', async () => {
      const newInventoryUpdate = await createAfnInventoryDailyUpdate();

      const deleteResponse = await request(app).delete(
        `/afnInventoryDailyUpdates/${newInventoryUpdate.afnInventoryDailyUpdateId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create an Amazon FBA Inventory Daily Update
 * @async
 * @function createAfnInventoryDailyUpdate
 * @return {Promise<Object>} Promise object that represents the created Amazon FBA Inventory Daily Update
 */
async function createAfnInventoryDailyUpdate() {
  const newInventoryUpdateData = generateAfnInventoryDailyUpdateData();
  const response = await request(app)
    .post('/afnInventoryDailyUpdates')
    .send(newInventoryUpdateData);

  return response.body;
}

/**
 * Helper function to generate Amazon FBA Inventory Daily Update data
 * @function generateAfnInventoryDailyUpdateData
 * @return {Object} Object containing Amazon FBA Inventory Daily Update data
 */
function generateAfnInventoryDailyUpdateData() {
  return {
    skuId: 1, // Example SKU ID, generate or fetch as appropriate
    sku: 'EXAMPLESKU123',
    countryCode: 'US',
    actualPrice: 100.0,
    currencyCode: 'USD',
    afnFulfillableQuantity: 10,
    reportDocumentId: `Doc-${Date.now()}`, // Example document ID
  };
}
