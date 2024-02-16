const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe(`ProductTaxCategory Model Tests`, () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // Basic tests for creating, updating, deleting, and retrieving data
  test('Select a valid ProductTaxCategory', async () => {
    const productTaxCategory = await db.ProductTaxCategory.findByPk(1);
    expect(productTaxCategory.productTaxCategoryName).toBe('A_GEN_STANDARD');
  });

  // Association tests
  test('ProductTaxCategory hasMany Asin', async () => {
    const expectedTaxProducCategoryId = 10;
    const asins = await db.Asin.findAll({
      where: { productTaxCategoryId: expectedTaxProducCategoryId },
    });
    asins.forEach(asin => {
      expect(asin.productCategoryRankId).toBe(expectedTaxProducCategoryId);
    });
  });

  test('ProductTaxCategory belongsTo Country and VatCategory', async () => {
    const productCategoryRank = await db.ProductTaxCategory.findAll({
      where: {
        vatCategoryId: 'S',
        countryCode: 'FR',
      },
    });
    expect(productCategoryRank.length).toBe(2);
  });
});
