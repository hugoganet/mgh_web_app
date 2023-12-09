const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`Sku Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid Sku
  test('Create a valid Sku', async () => {
    const validSkuData = {
      sku: 'TESTSKU123',
      countryCode: 'FR',
      skuAcquisitionCostExc: 10.0,
      skuAcquisitionCostInc: 12.0,
      numberOfUnitSold: 100,
    };

    const sku = await db.Sku.create(validSkuData);

    expect(sku).toHaveProperty('skuId');
    expect(sku.sku).toEqual(validSkuData.sku);
    expect(sku.countryCode).toEqual(validSkuData.countryCode);
    expect(sku.isActive).toEqual(true); // default value
  });

  // Fail to create a Sku with invalid data
  test('Fail to create a Sku with missing skuAcquisitionCostInc ', async () => {
    expect.assertions(1);
    try {
      await db.Sku.create({
        sku: 'TESTSKU123',
        countryCode: 'FR',
        skuAcquisitionCostExc: 10.0,
        skuAcquisitionCostInc: null,
        numberOfUnitSold: 0,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // Update an Sku
  test('Update an Sku', async () => {
    const skuDataToUpdate = {
      sku: 'TESTSKU123',
      countryCode: 'FR',
      skuAcquisitionCostExc: 10.0,
      skuAcquisitionCostInc: 12.0,
      numberOfUnitSold: 100,
    };

    const sku = await db.Sku.create(skuDataToUpdate);
    sku.skuAcquisitionCostExc = 15.0;
    const updatedSku = await sku.save();

    expect(updatedSku).toHaveProperty('skuId');
    expect(updatedSku.skuAcquisitionCostExc).toEqual(15.0);
  });

  // Delete an Sku
  test('Delete an Sku', async () => {
    const skuDataToDelete = {
      sku: 'TESTSKU123',
      countryCode: 'DE',
      skuAcquisitionCostExc: 10.0,
      skuAcquisitionCostInc: 12.0,
      numberOfUnitSold: 100,
    };

    const sku = await db.Sku.create(skuDataToDelete);
    await sku.destroy();

    const deletedSku = await db.Sku.findByPk(sku.skuId);
    expect(deletedSku).toBeNull();
  });

  // ASSOCIATION TESTS
  // Sku belongsTo Country
  test('Fail to create an Sku with invalid Country', async () => {
    expect.assertions(1);
    try {
      await db.Sku.create({
        sku: 'TESTSKU123',
        countryCode: 'US',
        skuAcquisitionCostExc: 10.0,
        skuAcquisitionCostInc: 12.0,
        numberOfUnitSold: 0,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // Sku belongsToMany Asin through AsinSku
  test('Retrieve Asin associated with Sku', async () => {
    // Fetch the Sku by the Sku value
    const skuRecord = await db.Sku.findOne({
      where: { sku: 'ORNI-06.23-29,4-B0089C15XC' },
      include: db.Asin,
    });
    // Fetch the Asin associated with the Sku
    expect(skuRecord.Asins[0].asin).toBe('B0089C15XC');
  });
});
