const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe('Warehouse Model Tests', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid Warehouse
  test('Create a valid Warehouse', async () => {
    const warehouse = await db.Warehouse.create({
      warehouseName: 'Central Warehouse',
      warehouseAddress: '1 rue de la paix',
      warehousePostcode: '75000',
      warehouseCity: 'Paris',
      warehouseCountry: 'France',
      warehouseContactName: 'John Doe',
      warehouseContactNumber: '0123456789',
      warehouseContactEmail: 'john@test.com',
    });
    expect(warehouse).toHaveProperty('warehouseId');
    expect(warehouse.warehouseName).toBe('Central Warehouse');
  });

  // Fail to create a Warehouse (look for constraint errors or datatype errors)
  test('Fail to create a valid Warehouse', async () => {
    await expect(
      db.Warehouse.create({
        warehouseName: 'Central Warehouse 2',
        warehouseAddress: '1 rue de la paix',
        warehousePostcode: '75000',
        warehouseCity: 'Paris',
        warehouseCountry: 'France',
        warehouseContactName: null, // required field
        warehouseContactNumber: '0123456789',
        warehouseContactEmail: 'john@test.com',
      }),
    ).rejects.toThrow();
  });

  // Update a Warehouse
  test('Update a valid Warehouse', async () => {
    const warehouse = await db.Warehouse.create({
      warehouseName: 'Central Warehouse 3',
      warehouseAddress: '1 rue de la paix',
      warehousePostcode: '75000',
      warehouseCity: 'Paris',
      warehouseCountry: 'France',
      warehouseContactName: 'John Doe',
      warehouseContactNumber: '0123456789',
      warehouseContactEmail: 'john@test.com',
    });
    await warehouse.update({ warehouseName: 'Updated Warehouse' });
    expect(warehouse.warehouseName).toBe('Updated Warehouse');
  });

  // Delete a Warehouse
  test('Delete a valid Warehouse', async () => {
    const warehouse = await db.Warehouse.create({
      warehouseName: 'Central Warehouse 4',
      warehouseAddress: '1 rue de la paix',
      warehousePostcode: '75000',
      warehouseCity: 'Paris',
      warehouseCountry: 'France',
      warehouseContactName: 'John Doe',
      warehouseContactNumber: '0123456789',
      warehouseContactEmail: 'john@test.com',
    });
    await warehouse.destroy();
    const deletedWarehouse = await db.Warehouse.findByPk(warehouse.warehouseId);
    expect(deletedWarehouse).toBeNull();
  });

  // ASSOCIATION TESTS - only test the belongsTo and belongsToMany associations
  // belongsToMany Ean through WarehouseStock
  // retrieve the total quantity of eans in each warehouse
  test('retrieve the total quantity of eans in each warehouse', async () => {
    // Assuming you have some warehouses and EANs already added to your database.
    // This will include through model data including the quantity of each EAN in the warehouse.
    const warehousesWithEans = await db.Warehouse.findAll({
      include: [
        {
          model: db.Ean,
          through: {
            model: db.WarehouseStock,
            attributes: ['warehouseInStockQuantity'], // Select only the quantity attribute
          },
        },
      ],
    });

    // Now check the retrieved data
    for (const warehouse of warehousesWithEans) {
      let totalQuantity = 0;
      warehouse.Eans.forEach(ean => {
        totalQuantity += ean.WarehouseStock.warehouseInStockQuantity;
      });

      //   console.log(
      //     `Warehouse ${warehouse.warehouseId} has a total EAN quantity of: ${totalQuantity}`,
      //   );
      expect(totalQuantity).toBeGreaterThanOrEqual(0); // Assuming quantity cannot be negative
    }
  });
});
