const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`Ean Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
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
  test('Ean belongs to Brand', async () => {
    const ean = await db.Ean.findByPk('9782012272323');
    const brand = await ean.getBrand();
    expect(brand.brandName).toBe("DEUX COQS D'OR");
  });

  test('Select all Asin records associated with a given Ean', async () => {
    const ean = await db.Ean.findByPk('3553330100485');
    const asins = await ean.getAsins();
    expect(asins).toBeInstanceOf(Array);
    expect(asins.length).toBeGreaterThan(0);
  });

  // Test to check ON DELETE NO ACTION
  test('Ean deletion should not be allowed if associated with Asin', async () => {
    // Assuming eanToDelete is an Ean that is associated with some Asin records
    const eanToDelete = await db.Ean.findByPk('3553330100485');

    try {
      await eanToDelete.destroy();
    } catch (error) {
      // Expect an error due to the NO ACTION constraint
      expect(error).toBeDefined();
    }

    // Check if the Ean still exists
    const eanStillExists = await db.Ean.findByPk('3553330100485');
    expect(eanStillExists).not.toBeNull();
  });
});
