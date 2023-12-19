const request = require('supertest');
const app = require('../../../src/app');

describe('EANs In ASINs API Routes', () => {
  describe('GET /eansInAsins', () => {
    it('should retrieve a list of EAN-ASIN associations', async () => {
      const response = await request(app).get('/eansInAsins');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('GET /eansInAsins/:id', () => {
    it('should retrieve an EAN-ASIN association by ID', async () => {
      const newAssociation = await createEanInAsin();
      const response = await request(app).get(
        `/eansInAsins/${newAssociation.eanInAsinId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'eanInAsinId',
        newAssociation.eanInAsinId,
      );
    });
  });

  describe('POST /eansInAsins', () => {
    it('should create a new EAN-ASIN association', async () => {
      const newAssociationData = await generateEanInAsinData();
      const response = await request(app)
        .post('/eansInAsins')
        .send(newAssociationData);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('eanInAsinId');
    });
  });

  describe('PATCH /eansInAsins/:id', () => {
    it('should update an EAN-ASIN association by ID', async () => {
      const newAssociation = await createEanInAsin();
      const updatedData = { eanInAsinQuantity: 30 };
      const response = await request(app)
        .patch(`/eansInAsins/${newAssociation.eanInAsinId}`)
        .send(updatedData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /eansInAsins/:id', () => {
    it('should delete an EAN-ASIN association', async () => {
      const newAssociation = await createEanInAsin();
      const response = await request(app).delete(
        `/eansInAsins/${newAssociation.eanInAsinId}`,
      );
      expect(response.statusCode).toBe(200);
    });
  });
});

/**
 * Generates random EAN data for testing.
 * @return {Object} An object containing EAN data.
 */
function generateEanData() {
  return {
    ean: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
    productName: 'Test Product',
    brandId: 1,
  };
}

/**
 * Creates an EAN for use in testing.
 * @async
 * @return {Promise<Object>} A promise that resolves to the created EAN.
 * @throws {Error} Throws an error if the creation fails.
 */
async function createEan() {
  const eanData = generateEanData();
  const response = await request(app).post('/eans').send(eanData);

  if (response.statusCode !== 201) {
    throw new Error('Failed to create EAN');
  }

  return response.body;
}

/**
 * Helper function to generate ASIN data
 * @function generateAsinData
 * @return {Object} Object containing ASIN data
 */
function generateAsinData() {
  const asin = Date.now().toString().slice(0, 10);
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
 * Creates an ASIN for use in testing.
 * @async
 * @return {Promise<Object>} A promise that resolves to the created ASIN.
 * @throws {Error} Throws an error if the creation fails.
 */
async function createAsin() {
  const asinData = generateAsinData();
  const response = await request(app).post('/asins').send(asinData);

  if (response.statusCode !== 201) {
    throw new Error('Failed to create ASIN');
  }

  return response.body;
}

/**
 * Generates data for creating an EAN-ASIN association for testing.
 * @async
 * @return {Promise<Object>} A promise that resolves to the data object for creating an EAN-ASIN association.
 */
async function generateEanInAsinData() {
  const newAsin = await createAsin();
  const newEan = await createEan();

  return {
    asinId: newAsin.asinId,
    ean: newEan.ean,
    eanInAsinQuantity: 10,
  };
}

/**
 * Creates an EAN-ASIN association in the system for testing purposes.
 * @async
 * @return {Promise<Object>} A promise that resolves to the created EAN-ASIN association.
 * @throws {Error} Throws an error if the creation fails.
 */
async function createEanInAsin() {
  const newAssociationData = await generateEanInAsinData();
  const response = await request(app)
    .post('/eansInAsins')
    .send(newAssociationData);

  if (response.statusCode !== 201) {
    throw new Error('Failed to create EAN-ASIN association');
  }

  return response.body;
}
