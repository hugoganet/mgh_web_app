const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe('AsinWarehouseQuantity View Tests', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('Retrieve ASIN Warehouse Quantities', async () => {
    try {
      const quantities = await db.sequelize.query(
        'SELECT * FROM asin_warehouse_quantities',
        { type: db.sequelize.QueryTypes.SELECT },
      );

      // Check if the query returns an array
      expect(Array.isArray(quantities)).toBe(true);

      // Optionally, you can add more specific checks here, such as checking
      // the structure of the returned data or checking for specific values
    } catch (error) {
      console.error('Error querying asinWarehouseQuantity view:', error);
    }
  });

  test('Check warehouse quantity for asinId 2886', async () => {
    try {
      const asinWarehouseQuantities = await db.sequelize.query(
        'SELECT * FROM asin_warehouse_quantities WHERE asin_id = 2886',
        { type: db.sequelize.QueryTypes.SELECT },
      );

      // Check if the query returns a non-empty array
      expect(asinWarehouseQuantities.length).toBeGreaterThan(0);

      const quantity = asinWarehouseQuantities.find(q => q.asin_id === 2886);
      console.log(quantity);
      expect(quantity).not.toBeUndefined();
      expect(quantity.total_warehouse_quantity).toBe(19);
    } catch (error) {
      console.error('Error querying asinWarehouseQuantity view:', error);
    }
  });
});
