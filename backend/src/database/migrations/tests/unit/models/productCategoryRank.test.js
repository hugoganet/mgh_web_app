const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`ProductCategoryRank Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // Basic tests for creating, updating, deleting, and retrieving data
  test('Select a valid ProductCategoryRank', async () => {
    const expectedVatRate = 1.0;
    const productCategoryRank = await db.ProductCategoryRank.findByPk(1);
    expect(parseFloat(productCategoryRank.rankingThresholdPercentage)).toBe(
      expectedVatRate,
    );
  });

  // Association tests
  test('ProductCategoryRank belongsTo ProductCategory', async () => {
    const productCategoryRank = await db.ProductCategoryRank.findAll({
      where: {
        productCategoryId: 1,
        countryCode: 'FR',
      },
    });
    expect(productCategoryRank.length).toBe(18);
  });

  test('ProductCategoryRank hasMany Asin', async () => {
    const expectedProducCategoryRankId = 10;
    const asins = await db.Asin.findAll({
      where: { productCategoryRankId: expectedProducCategoryRankId },
    });
    asins.forEach(asin => {
      expect(asin.productCategoryRankId).toBe(expectedProducCategoryRankId);
    });
  });
});
