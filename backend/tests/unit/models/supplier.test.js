const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe(`Supplier Model Tests`, () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid Supplier
  test('Create a valid Supplier', async () => {
    const supplier = await db.Supplier.create({
      supplierName: 'Acme Supplies',
      supplierWebsite: 'http://acmesupplies.com',
      supplierNumber: '1234567890',
      supplierEmail: 'contact@acmesupplies.com',
      supplierAddress: '123 Acme Way',
      supplierPostcode: 'AC123',
      countryCode: 'FR',
      productCategoryId: 1,
      contactName: 'John Doe',
      contactPosition: 'Sales Manager',
      contactNumber: '9876543210',
      contactEmail: 'john.doe@acmesupplies.com',
    });
    expect(supplier).toHaveProperty('supplierId');
  });

  // Fail to create a Supplier with Unique constraint for supplierName (KONG)
  test('Fail to create a Supplier with supplierName that already exist', async () => {
    await expect(
      db.Supplier.create({
        supplierName: 'KONG',
        supplierWebsite: 'http://kongtest.com',
        supplierNumber: '1234567897',
        supplierEmail: 'contact@kongsupplies.com',
        supplierAddress: '123 Acme Ways',
        supplierPostcode: 'AC1233',
        countryCode: 'FR',
        productCategoryId: 1,
        contactName: 'John Doe',
        contactPosition: 'Sales Manager',
        contactNumber: '9876543210',
        contactEmail: 'john.doe@acmesupplies.com',
      }),
    ).rejects.toThrow();
  });

  // Update a Supplier
  test('Update a valid Supplier', async () => {
    const supplier = await db.Supplier.create({
      supplierName: 'Acme Supplies test',
      supplierWebsite: 'http://acmesuppliestest.com',
      supplierNumber: '1234567899',
      supplierEmail: 'contact@testacmesupplies.com',
      supplierAddress: '123 Acme test Way',
      supplierPostcode: 'AC12399',
      countryCode: 'FR',
      productCategoryId: 1,
      contactName: 'John Doe',
      contactPosition: 'Sales Manager',
      contactNumber: '9876543210',
      contactEmail: 'john.doe@acmesupplies.com',
    });
    supplier.supplierEmail = 'newemail@acmesupplies.com';
    await supplier.save();

    const updatedSupplier = await db.Supplier.findByPk(supplier.supplierId);
    expect(updatedSupplier.supplierEmail).toBe('newemail@acmesupplies.com');
  });

  // Delete a Supplier
  test('Delete a valid Supplier', async () => {
    const supplier = await db.Supplier.create({
      supplierName: 'Acme Supplies test2',
      supplierWebsite: 'http://acmesuppliestest2.com',
      supplierNumber: '12345678992',
      supplierEmail: 'contact@test2acmesupplies.com',
      supplierAddress: '123 Acme test2 Way',
      supplierPostcode: 'AC123992',
      countryCode: 'FR',
      productCategoryId: 1,
      contactName: 'John Doe',
      contactPosition: 'Sales Manager',
      contactNumber: '9876543210',
      contactEmail: 'john.doe@acmesupplies.com',
    });
    await supplier.destroy();

    const deletedSupplier = await db.Supplier.findByPk(supplier.supplierId);
    expect(deletedSupplier).toBeNull();
  });

  // ASSOCIATION TESTS - only test the belongsTo and belongsToMany associations
  // belongsTo
  // Fail to create a Supplier due to nonexistent foreign key (countryCode)
  test('Fail to create a Supplier due to nonexistent foreign key (countryCode)', async () => {
    await expect(
      db.Supplier.create({
        supplierName: 'Acme Supplies test22',
        supplierWebsite: 'http://acmesuppliestest22.com',
        supplierNumber: '123456789922',
        supplierEmail: 'contact@test222 Way',
        supplierPostcode: 'AC1239922',
        countryCode: 'US', // Nonexistent countryCode
        productCategoryId: 1,
        contactName: 'John Doe',
        contactPosition: 'Sales Manager',
        contactNumber: '9876543210',
        contactEmail: 'john.doe@acmesupplies.com',
      }),
    ).rejects.toThrow();
  });

  // Fail to create a Supplier due to nonexistent foreign key (productCategoryId)
  test('Fail to create a Supplier due to nonexistent foreign key (productCategoryId)', async () => {
    await expect(
      db.Supplier.create({
        supplierName: 'Acme Supplies test222',
        supplierWebsite: 'http://acmesuppliestest222.com',
        supplierNumber: '1234567899222',
        supplierEmail: 'contact@test2222 Way',
        supplierPostcode: 'AC12399222',
        countryCode: 'US',
        productCategoryId: 9991, // Nonexistent productCategoryId
        contactName: 'John Doe',
        contactPosition: 'Sales Manager',
        contactNumber: '9876543210',
        contactEmail: 'john.doe@acmesupplies.com',
      }),
    ).rejects.toThrow();
  });

  // Retrieve all Suppliers with productCategory.productCategoryNameEn(Beauty)
  test('Retrieve all SupplierNames with ProductCategoryNameEn "Beauty"', async () => {
    // First, find the ProductCategory ID for 'Beauty'
    const category = await db.ProductCategory.findOne({
      where: { productCategoryNameEn: 'Beauty' },
    });
    expect(category).not.toBeNull();

    // Assuming that the association between Supplier and ProductCategory is set up correctly,
    // now retrieve all suppliers for the 'Beauty' category
    const suppliers = await db.Supplier.findAll({
      include: [
        {
          model: db.ProductCategory,
          where: { productCategoryNameEn: 'Beauty' },
        },
      ],
    });

    // We expect to find at least one supplier associated with the 'Beauty' category
    expect(suppliers.length).toBeGreaterThan(0);

    // Check that all retrieved suppliers have the expected association
    suppliers.forEach(supplier => {
      expect(supplier.ProductCategory.productCategoryNameEn).toBe('Beauty');
    });
  });

  // belongsToMany Brand through SupplierBrandCatalog
  // Retrieve all Suppliers with Brand.brandName(ECO STYLE)
  test('Retrieve all Suppliers with Brand.brandName "ECO STYLE"', async () => {
    // Retrieve all suppliers associated with the 'ECO STYLE' brand
    const suppliersWithBrand = await db.Supplier.findAll({
      include: [
        {
          model: db.Brand,
          where: { brandName: 'ECO STYLE' },
          through: { model: db.SupplierBrandCatalog },
        },
      ],
    });

    // We expect to find at least one supplier associated with the 'ECO STYLE' brand
    expect(suppliersWithBrand.length).toBeGreaterThan(0);

    // Optionally, check if the retrieved suppliers actually have the brand 'ECO STYLE'
    suppliersWithBrand.forEach(supplier => {
      const hasEcoStyleBrand = supplier.Brands.some(
        brand => brand.brandName === 'ECO STYLE',
      );
      expect(hasEcoStyleBrand).toBe(true);
    });
  });
});
