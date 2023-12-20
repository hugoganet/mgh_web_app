const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe(`Asin Model Tests`, () => {
  beforeAll(async () => {
    await initializeTestDatabase();
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
        countryCode: 'FR',
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

  // ASSOCIATION TESTS

  // Asin belongsTo ProductCategory
  test('Fail to create an Asin with invalid ProductCategory', async () => {
    expect.assertions(1); // This ensures that one assertion is called. Otherwise a fulfilled promise would not fail the test.
    try {
      await db.Asin.create({
        asin: 'B01N5IB20Q',
        countryCode: 'FR',
        productCategoryId: 999, // This is an invalid productCategoryId
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
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // Asin belongsTo ProductCategoryRank
  test('Fail to create an Asin with invalid ProductCategoryRank', async () => {
    expect.assertions(1); // This ensures that one assertion is called. Otherwise a fulfilled promise would not fail the test.
    try {
      await db.Asin.create({
        asin: 'B01N5IB22Q',
        countryCode: 'FR',
        productCategoryId: 1,
        productCategoryRankId: 9999, // This is an invalid productCategoryRankId
        productTaxCategoryId: 1,
        asinName: 'Example Product Name 2',
        urlAmazon: 'http://example.com/product',
        urlImage: 'http://example.com/product.jpg',
        asinPotentialWarehousesQuantity: 10,
        asinNumberOfActiveSku: 5,
        asinAverageUnitSoldPerDay: 2.5,
        isBatteryRequired: false,
        isHazmat: false,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // Asin belongsTo ProductTaxCategory
  test('Fail to create an Asin with invalid ProductTaxCategory', async () => {
    expect.assertions(1); // This ensures that one assertion is called. Otherwise a fulfilled promise would not fail the test.
    try {
      await db.Asin.create({
        asin: 'B01N5IB22Q',
        countryCode: 'FR',
        productCategoryId: 1,
        productCategoryRankId: 1,
        productTaxCategoryId: 9999,
        asinName: 'Example Product Name 2',
        urlAmazon: 'http://example.com/product',
        urlImage: 'http://example.com/product.jpg',
        asinPotentialWarehousesQuantity: 10,
        asinNumberOfActiveSku: 5,
        asinAverageUnitSoldPerDay: 2.5,
        isBatteryRequired: false,
        isHazmat: false,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // Asin belongsTo Country
  test('Fail to create an Asin with invalid Country', async () => {
    expect.assertions(1); // This ensures that one assertion is called. Otherwise a fulfilled promise would not fail the test.
    try {
      await db.Asin.create({
        asin: 'B01N5IB22Q',
        countryCode: 'US', // This is an invalid countryCode
        productCategoryId: 1,
        productCategoryRankId: 1,
        productTaxCategoryId: 1,
        asinName: 'Example Product Name 2',
        urlAmazon: 'http://example.com/product',
        urlImage: 'http://example.com/product.jpg',
        asinPotentialWarehousesQuantity: 10,
        asinNumberOfActiveSku: 5,
        asinAverageUnitSoldPerDay: 2.5,
        isBatteryRequired: false,
        isHazmat: false,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // Asin belongsToMany Ean through EanInAsin
  test('Return all ASINs where eanInAsinQuantity is greater than 1', async () => {
    expect.assertions(1);

    // Fetch ASINs with their associated Eans records where eanInAsinQuantity > 1
    const asinsWithMultipleEans = await db.Asin.findAll({
      include: [
        {
          model: db.Ean,
          through: {
            model: db.EanInAsin,
            where: { eanInAsinQuantity: { [db.Sequelize.Op.gt]: 1 } },
          },
          required: true,
        },
      ],
    });
    // Assuming there is at least one ASIN with eanInAsinQuantity > 1 for the test to pass
    expect(asinsWithMultipleEans.length).toBeGreaterThan(0);
  });

  // Asin belongsToMany Sku through AsinSku
  test('Should return all Skus for Asin "B00OHVDP5K"', async () => {
    // Fetch the Asin by the ASIN value
    const asinRecord = await db.Asin.findOne({ where: { asin: 'B00OHVDP5K' } });

    // If Asin is not found, there's an error in the setup
    if (!asinRecord) {
      throw new Error(
        'Asin with the specified ASIN code does not exist in the test database',
      );
    }

    // Fetch the associated Skus using the automatically generated Sequelize method
    const skusForAsin = await asinRecord.getSkus();

    // Assertions
    expect(skusForAsin).not.toBeNull();
    expect(Array.isArray(skusForAsin)).toBe(true);
    skusForAsin.forEach(sku => {
      expect(sku).toHaveProperty('sku');
      expect(sku).toHaveProperty('countryCode');
    });
  });
});
