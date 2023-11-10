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

  // ASSOCIATION TESTS
  // belongsToMany Supplier trhough SupplierBrandCatalog
  test('Retrieve the Suppliers of Brand(1)', async () => {
    // Assuming you have a Brand model and its associations are set up
    const brand = await db.Brand.findByPk(81, {
      include: [
        {
          model: db.Supplier,
          through: { model: db.SupplierBrandCatalog },
        },
      ],
    });

    // Check if brand is not null
    expect(brand).not.toBeNull();

    // Check if brand has suppliers
    expect(brand.Suppliers).not.toBeNull();

    // Optionally, if you want to check for specific properties or length
    expect(brand.Suppliers.length).toBeGreaterThan(0);

    // Check if suppliers are instances of the Supplier model
    brand.Suppliers.forEach(supplier => {
      expect(supplier instanceof db.Supplier).toBe(true);
    });
  });
});
