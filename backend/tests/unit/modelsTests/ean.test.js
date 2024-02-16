const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe(`Ean Model Tests`, () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // CREATE Tests
  test('Create a valid Ean', async () => {
    const validEan = await db.Ean.create({
      ean: '1234567890123',
      productName: 'Test Product',
    });
    expect(validEan.ean).toBe('1234567890123');
    expect(validEan.productName).toBe('Test Product');
  });

  test('Fail to create Ean with invalid EAN', async () => {
    await expect(
      db.Ean.create({
        ean: '123',
        productName: 'Invalid EAN Product',
      }),
    ).rejects.toThrow();
  });

  // UPDATE Tests
  test('Update Ean product name', async () => {
    const eanToUpdate = await db.Ean.create({
      ean: '9876543210987',
      productName: 'Old Product Name',
    });

    const updatedEan = await eanToUpdate.update({
      productName: 'New Product Name',
    });

    expect(updatedEan.productName).toBe('New Product Name');
  });

  test('Fail to update Ean with empty product name', async () => {
    const eanToUpdate = await db.Ean.create({
      ean: '9876543210123',
      productName: 'Some Product',
    });

    await eanToUpdate
      .update({
        productName: null,
      })
      .catch(e => null); // Catch and ignore the error

    const notUpdatedEan = await db.Ean.findByPk('9876543210123');

    // Check that the productName did not change
    expect(notUpdatedEan.productName).toBe('Some Product');
  });

  // DELETE Tests
  test('Delete an Ean', async () => {
    const eanToDelete = await db.Ean.create({
      ean: '5678901234567',
      productName: 'Product to Delete',
    });

    await eanToDelete.destroy();
    const deletedEan = await db.Ean.findByPk('5678901234567');

    expect(deletedEan).toBeNull();
  });

  test('Fail to delete non-existent Ean', async () => {
    const nonExistentEAN = '0000000000000';
    const eanToDelete = await db.Ean.findByPk(nonExistentEAN);

    if (eanToDelete) {
      await expect(eanToDelete.destroy()).rejects.toThrow();
    } else {
      expect(eanToDelete).toBeNull();
    }
  });

  // ASSOCIATION Tests
  // Ean belongsTo Brand
  test('Ean belongs to Brand', async () => {
    const ean = await db.Ean.findByPk('9782012272323');
    const brand = await ean.getBrand();
    expect(brand.brandName).toBe("DEUX COQS D'OR");
  });

  // belongsToMany Asin through EanInAsin
  test('Select all Asin records associated with a given Ean', async () => {
    const ean = await db.Ean.findByPk('3553330100485');
    const asins = await ean.getAsins();

    expect(asins).toBeInstanceOf(Array);
    expect(asins.length).toBeGreaterThan(0);
  });

  // Ean belongsToMany SupplierOrder through EanInSupplierOrder
  test('Select all SupplierOrder records associated with a given Ean(8410436208611)', async () => {
    const ean = await db.Ean.findByPk('8410436208611', {
      include: [
        {
          model: db.SupplierOrder,
          through: { model: db.EanInSupplierOrder },
        },
      ],
    });

    expect(ean).not.toBeNull();
    expect(ean.SupplierOrders).not.toBeNull();
    ean.SupplierOrders.forEach(order => {
      expect(order instanceof db.SupplierOrder).toBe(true);
    });
  });

  // Ean belongsToMany Donation through EanInDonation
  test('Select all Donation records associated with a given Ean(9782810418800)', async () => {
    const ean = await db.Ean.findByPk('9782810418800', {
      include: [
        {
          model: db.Donation,
          through: { model: db.EanInDonation },
          as: 'Donations',
        },
      ],
    });

    expect(ean).not.toBeNull();
    expect(ean.Donations).not.toBeNull();
    ean.Donations.forEach(donation => {
      expect(donation instanceof db.Donation).toBe(true);
    });
  });

  // Ean belongsToMany Warehouse through WarehouseStock
  test('Select all Warehouse records associated with a given Ean(5022496101349)', async () => {
    const ean = await db.Ean.findByPk('5022496101349', {
      include: [
        {
          model: db.Warehouse,
          through: { model: db.WarehouseStock },
          as: 'Warehouses', // Replace with the correct association alias
        },
      ],
    });

    expect(ean).not.toBeNull();
    expect(ean.Warehouses).not.toBeNull();
    ean.Warehouses.forEach(warehouse => {
      expect(warehouse instanceof db.Warehouse).toBe(true);
    });
  });
});
