const request = require('supertest');
const app = require('../../../src/app'); // Adjust the path as needed
const { initializeTestDatabase, closeDatabase } = require('../../jest.setup');

describe('Supplier Orders API Routes', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /suppliersOrders', () => {
    it('should retrieve a list of supplier orders', async () => {
      const response = await request(app).get('/suppliersOrders');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /suppliersOrders/:supplierOrderId', () => {
    it('should retrieve a single supplier order by ID', async () => {
      const newOrder = await createSupplierOrder();
      const response = await request(app).get(
        `/suppliersOrders/${newOrder.supplierOrderId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'supplierOrderId',
        newOrder.supplierOrderId,
      );
    });
  });

  describe('POST /suppliersOrders', () => {
    it('should create a new supplier order', async () => {
      const newOrderData = generateSupplierOrderData();
      const response = await request(app)
        .post('/suppliersOrders')
        .send(newOrderData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('supplierOrderId');
    });
  });

  describe('PATCH /suppliersOrders/:supplierOrderId', () => {
    it('should update an existing supplier order', async () => {
      const newOrder = await createSupplierOrder();
      const updatedData = {
        supplierOrderNumberOfUnit: 20, // Example update
        // Include other fields to update
      };

      const response = await request(app)
        .patch(`/suppliersOrders/${newOrder.supplierOrderId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /suppliersOrders/:supplierOrderId', () => {
    it('should delete a supplier order', async () => {
      const newOrder = await createSupplierOrder();

      const deleteResponse = await request(app).delete(
        `/suppliersOrders/${newOrder.supplierOrderId}`,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});

/**
 * Helper function to create a supplier order
 * @async
 * @function createSupplierOrder
 * @return {Promise<Object>} Promise object that represents the created supplier order
 */
async function createSupplierOrder() {
  const newOrderData = generateSupplierOrderData();
  const response = await request(app)
    .post('/suppliersOrders')
    .send(newOrderData);

  return response.body;
}

/**
 * Helper function to generate supplier order data
 * @function generateSupplierOrderData
 * @return {Object} Object containing supplier order data
 */
function generateSupplierOrderData() {
  return {
    supplierId: 1,
    warehouseId: 1,
    supplierOrderMadeDate: '2023-12-01',
    supplierOrderDeliveryDate: '2023-12-10',
    supplierOrderNumberOfUnit: 10,
    supplierOrderTotalPaidExc: 1000.0,
    supplierOrderDeliveryCostExc: 50.0,
    supplierOrderDeliveryCostVatRate: 0.2,
    supplierOrderVatPaid: 200.0,
  };
}
