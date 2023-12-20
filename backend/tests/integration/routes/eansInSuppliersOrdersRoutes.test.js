const request = require('supertest');
const app = require('../../../src/app');
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('EANs In Suppliers Orders API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /eansInSuppliersOrders', () => {
    it('should retrieve a list of EANs in suppliers orders', async () => {
      const response = await request(app).get('/eansInSuppliersOrders');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /eansInSuppliersOrders/:eanInSupplierOrderId', () => {
    it('should retrieve a single EAN in a supplier order by ID', async () => {
      const newEanInSupplierOrder = await createEanInSupplierOrder();
      const response = await request(app).get(
        `/eansInSuppliersOrders/${newEanInSupplierOrder.eanInSupplierOrderId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'eanInSupplierOrderId',
        newEanInSupplierOrder.eanInSupplierOrderId,
      );
    });
  });

  describe('POST /eansInSuppliersOrders', () => {
    it('should create a new EAN in a supplier order', async () => {
      const newEanInSupplierOrderData = await generateEanInSupplierOrderData();
      const response = await request(app)
        .post('/eansInSuppliersOrders')
        .send(newEanInSupplierOrderData);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('eanInSupplierOrderId');
    });
  });

  describe('PATCH /eansInSuppliersOrders/:eanInSupplierOrderId', () => {
    it('should update an existing EAN in a supplier order', async () => {
      const newEanInSupplierOrder = await createEanInSupplierOrder();
      const updatedData = {
        eanOrderedQuantity: 50, // Updated quantity
      };
      const response = await request(app)
        .patch(
          `/eansInSuppliersOrders/${newEanInSupplierOrder.eanInSupplierOrderId}`,
        )
        .send(updatedData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /eansInSuppliersOrders/:eanInSupplierOrderId', () => {
    it('should delete an EAN in a supplier order', async () => {
      const newEanInSupplierOrder = await createEanInSupplierOrder();
      const deleteResponse = await request(app).delete(
        `/eansInSuppliersOrders/${newEanInSupplierOrder.eanInSupplierOrderId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Generates data for creating an EAN in a supplier order for testing.
 * @param {string} ean - The EAN code associated with the supplier order.
 * @param {number} supplierOrderId - The supplier order ID.
 * @return {Object} The data object for creating an EAN in a supplier order.
 */
async function generateEanInSupplierOrderData() {
  const newEan = await createEan();
  const newSupplierOrder = await createSupplierOrder();
  return {
    ean: newEan.ean,
    supplierOrderId: newSupplierOrder.supplierOrderId,
    eanOrderedQuantity: 100,
    productPurchaseCostExc: 10.0,
    productVatRate: 20,
  };
}

/**
 * Creates an EAN in a supplier order entry in the system for testing purposes.
 * @async
 * @return {Promise<Object>} A promise that resolves to the created EAN in a supplier order.
 * @throws {Error} Throws an error if the creation fails.
 */
async function createEanInSupplierOrder() {
  try {
    const eanInSupplierOrderData = await generateEanInSupplierOrderData();
    const response = await request(app)
      .post('/eansInSuppliersOrders')
      .send(eanInSupplierOrderData);

    if (response.statusCode !== 201) {
      throw new Error('Failed to create EAN in Supplier Order');
    }

    return response.body;
  } catch (error) {
    console.error('Error in createEanInSupplierOrder:', error);
    throw error;
  }
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
 * Creates a supplier order for use in testing.
 * @async
 * @return {Promise<Object>} A promise that resolves to the created supplier order.
 * @throws {Error} Throws an error if the creation fails.
 */
async function createSupplierOrder() {
  const supplierOrderData = {
    supplierId: 1,
    supplierOrderMadeDate: '2020-01-01',
    supplierOrderDeliveryDate: '2020-01-01',
    warehouseId: 1,
    supplierOrderNumberOfUnit: 100,
    supplierOrderTotalPaidExc: 100.0,
    supplierOrderDeliveryCostExc: 10.0,
    supplierOrderDeliveryCostVatRate: 0.2,
    supplierOrderVatPaid: 20.0,
  };

  const response = await request(app)
    .post('/suppliersOrders')
    .send(supplierOrderData);

  if (response.statusCode !== 201) {
    throw new Error('Failed to create Supplier Order');
  }

  return response.body;
}
