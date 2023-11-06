const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`Asin Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid Asin
  test('Create a valid Asin', async () => {
    const newAsin = await db.Asin.create({
      asin: 'B01N5IB20Q',
      countryCode: 'FR',
      productCategoryId: 1,
      productCategoryRankId: 1,
      productTaxCategoryId: 1,
      asinName: 'Example Product Name',
      urlAmazon: 'http://example.com/product', // Assuming this field can have any string URL.
      urlImage: 'http://example.com/product.jpg', // Assuming this field can have any string URL.
      asinPotentialWarehousesQuantity: 10,
      asinNumberOfActiveSku: 5,
      asinAverageUnitSoldPerDay: 2.5,
      isBatteryRequired: false,
      isHazmat: false,
    });
    expect(newAsin).toHaveProperty('asinId');
    expect(newAsin.asin).toBe('B01N5IB20Q');
  });

  // Fail to create an Asin with invalid data
  test('Fail to create an Asin with invalid data', async () => {
    await expect(
      db.Asin.create({
        asin: null, // asin is required and cannot be null
        countryCode: 'US',
        productCategoryRankId: 1,
        productTaxCategoryId: 1,
        asinName: 'Example Product Name',
      }),
    ).rejects.toThrow();
  });

  // Update an Asin
  test('Update an Asin', async () => {
    const createdAsin = await db.Asin.create({
      asin: 'B01N5IB20Q',
      countryCode: 'FR',
      productCategoryId: 1,
      productCategoryRankId: 1,
      productTaxCategoryId: 1,
      asinName: 'Example Product Name',
      urlAmazon: 'http://example.com/product',
      urlImage: 'http://example.com/product.jpg',
      asinPotentialWarehousesQuantity: 10,
      asinNumberOfActiveSku: 5,
      asinAverageUnitSoldPerDay: 2.5,
      isBatteryRequired: false,
      isHazmat: false,
    });

    await createdAsin.update({ asinName: 'Updated Product Name' });

    const updatedAsin = await db.Asin.findByPk(createdAsin.asinId);
    expect(updatedAsin.asinName).toBe('Updated Product Name');
  });

  // Delete an Asin
  test('Delete an Asin', async () => {
    const createdAsin = await db.Asin.create({
      asin: 'B01N5IB20Q',
      countryCode: 'FR',
      productCategoryId: 1,
      productCategoryRankId: 1,
      productTaxCategoryId: 1,
      asinName: 'Example Product Name',
      urlAmazon: 'http://example.com/product',
      urlImage: 'http://example.com/product.jpg',
      asinPotentialWarehousesQuantity: 10,
      asinNumberOfActiveSku: 5,
      asinAverageUnitSoldPerDay: 2.5,
      isBatteryRequired: false,
      isHazmat: false,
    });

    await createdAsin.destroy();
    const deletedAsin = await db.Asin.findByPk(createdAsin.asinId);
    expect(deletedAsin).toBeNull();
  });

  // // ASSOCIATION TESTS

  // // Asin belongsTo ProductCategory
  // test('Asin belongs to ProductCategory', async () => {
  //     createdAsin = await db.Asin.create({ /* ... */, productCategoryId: createdProductCategory.id });
  //     const associatedCategory = await createdAsin.getProductCategory();

  //     expect(associatedCategory).not.toBeNull();
  //     expect(associatedCategory.id).toBe(createdProductCategory.id);
  // });

  // // Asin belongsTo ProductCategoryRank
  // test('Asin belongs to ProductCategoryRank', async () => {
  //     createdAsin = await db.Asin.create({ /* ... */, productCategoryRankId: createdProductCategoryRank.id });
  //     const associatedCategoryRank = await createdAsin.getProductCategoryRank();

  //     expect(associatedCategoryRank).not.toBeNull();
  //     expect(associatedCategoryRank.id).toBe(createdProductCategoryRank.id);
  // });

  // // Asin belongsTo ProductTaxCategory
  // test('Asin belongs to ProductTaxCategory', async () => {
  //     createdAsin = await db.Asin.create({ /* ... */, productTaxCategoryId: createdProductTaxCategory.id });
  //     const associatedTaxCategory = await createdAsin.getProductTaxCategory();

  //     expect(associatedTaxCategory).not.toBeNull();
  //     expect(associatedTaxCategory.id).toBe(createdProductTaxCategory.id);
  // });

  // // Asin belongsTo Country
  // test('Asin belongs to Country', async () => {
  //     createdAsin = await db.Asin.create({ /* ... */, countryCode: createdCountry.countryCode });
  //     const associatedCountry = await createdAsin.getCountry();

  //     expect(associatedCountry).not.toBeNull();
  //     expect(associatedCountry.countryCode).toBe(createdCountry.countryCode);
  // });

  // // Asin belongsToMany Ean through EanInAsin
  // test('Asin belongsToMany Ean through EanInAsin', async () => {
  //     createdEan = await db.Ean.create({ /* ... */ });
  //     createdAsin = await db.Asin.create({ /* ... */ });
  //     await createdAsin.addEan(createdEan);

  //     const associatedEans = await createdAsin.getEans();

  //     expect(associatedEans).not.toBeNull();
  //     expect(associatedEans.length).toBeGreaterThan(0);
  //     expect(associatedEans.some(e => e.id === createdEan.id)).toBe(true);
  // });

  // // Asin belongsToMany Sku through AsinSku
  // test('Asin belongsToMany Sku through AsinSku', async () => {
  //     createdSku = await db.Sku.create({ /* ... */ });
  //     createdAsin = await db.Asin.create({ /* ... */ });
  //     await createdAsin.addSku(createdSku);

  //     const associatedSkus = await createdAsin.getSkus();

  //     expect(associatedSkus).not.toBeNull();
  //     expect(associatedSkus.length).toBeGreaterThan(0);
  //     expect(associatedSkus.some(s => s.id === createdSku.id)).toBe(true);
  // });
});
