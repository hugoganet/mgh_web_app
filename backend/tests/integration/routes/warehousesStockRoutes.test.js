const request = require('supertest');
const app = require('../../../src/app');
const { initializeDatabase, closeDatabase } = require('../../jest.setup');

describe('Warehouse Stock API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /warehousesStock', () => {
    it('should retrieve a list of warehouse stocks', async () => {
      const response = await request(app).get('/warehousesStock');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /warehousesStock/:warehouseStockId', () => {
    it('should retrieve a single warehouse stock by ID', async () => {
      const newStock = await createWarehouseStock();
      const response = await request(app).get(
        `/warehousesStock/${newStock.warehouseStockId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'warehouseStockId',
        newStock.warehouseStockId,
      );
    });
  });

  describe('POST /warehousesStock', () => {
    it('should create a new warehouse stock', async () => {
      const newStock = await generateWarehouseStockData();
      const response = await request(app)
        .post('/warehousesStock')
        .send(newStock);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('warehouseStockId');
    });
  });

  describe('PATCH /warehousesStock/:warehouseStockId', () => {
    it('should update an existing warehouse stock', async () => {
      const newStock = await createWarehouseStock();
      const updatedData = {
        warehouseInStockQuantity: 20,
      };

      const response = await request(app)
        .patch(`/warehousesStock/${newStock.warehouseStockId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /warehousesStock/:warehouseStockId', () => {
    it('should delete a warehouse stock', async () => {
      const newStock = await createWarehouseStock();

      const deleteResponse = await request(app).delete(
        `/warehousesStock/${newStock.warehouseStockId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to generate warehouse stock data
 * @function generateWarehouseStockData
 * @return {Object} Object containing warehouse stock data
 */
async function generateWarehouseStockData() {
  try {
    const newEan = await createEan();
    console.log('Generated EAN:', newEan.ean);
    return {
      warehouseId: 1,
      ean: newEan.ean,
      warehouseTotalReceivedQuantity: 100,
      warehouseTotalShippedQuantity: 50,
      warehouseInStockQuantity: 50,
    };
  } catch (error) {
    console.error('Error in generateWarehouseStockData:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

/**
 * Helper function to create a warehouse stock
 * @async
 * @function createWarehouseStock
 * @return {Promise<Object>} Promise object that represents the created warehouse stock
 */
async function createWarehouseStock() {
  try {
    const newStockData = await generateWarehouseStockData();
    const response = await request(app)
      .post('/warehousesStock')
      .send(newStockData);
    return response.body;
  } catch (error) {
    console.error('Error in createWarehouseStock:', error);
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
