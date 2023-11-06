const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`Brand Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // Basic tests for creating, updating, deleting, and retrieving data
  test('Create a valid Brand', async () => {
    // Test for creating a new instance
    try {
      const brand = await db.Brand.create({ brandName: 'Nike' });
      expect(brand.brandName).toBe('Nike');
    } catch (error) {
      console.error(error);
    }
  });

  test('Fail to create a Brand with invalid data', async () => {
    // Test for handling invalid data (e.g., missing countryCode or countryName)
    await expect(db.Brand.create({ brandName: 'AKILEÏNE' })).rejects.toThrow(); // Already exists in the database
    await expect(db.Brand.create({ brandName: null })).rejects.toThrow(); // is required
  });

  test('Update a Brand', async () => {
    // Test for updating an instance
    const brand = await db.Brand.findOne({ where: { brandName: 'ANJU' } });
    brand.brandName = 'ANJU Inc.';
    await brand.save();
    expect(brand.brandName).toBe('ANJU Inc.');
  });

  test('Delete a Brand', async () => {
    // Test for deleting an instance
    const brand = await db.Brand.findOne({ where: { brandName: 'ANKA' } });
    await brand.destroy();
    const deletedbrand = await db.Brand.findOne({
      where: { brandName: 'ANKA' },
    });
    expect(deletedbrand).toBeNull();
  });

  // Association tests
  test('Brand has many Eans', async () => {
    // Test for checking the association between Brand and Product
    const brand = await db.Brand.findOne({ where: { brandName: 'KONG' } });
    const eans = await brand.getEans();
    expect(eans.length).toBeGreaterThan(0);
  });
});
