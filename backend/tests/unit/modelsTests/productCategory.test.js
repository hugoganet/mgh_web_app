const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe(`ProductCategory Model Tests`, () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // Basic tests for creating, updating, deleting, and retrieving data
  test('Select a valid ProductCategory', async () => {
    // Test for select a valid category
    const productCategory = await db.ProductCategory.findOne({
      where: { productCategoryNameEn: 'Beauty' },
    });
    expect(productCategory.productCategoryNameFr).toBe('Beauté et Parfum');
  });

  // Association tests
  test('ProductCategory has many Asin', async () => {
    // Test for checking the association between ProductCategory and ProductTaxCategory
    const productCategory = await db.ProductCategory.findOne({
      where: { productCategoryNameEn: 'Grocery' },
    });
    const asins = await productCategory.getAsins();
    expect(asins.length).toBeGreaterThan(0);
  });

  // belongsToMany AmazonReferralFee through ProductAndAmzReferralFeeCategory
  test('retrieve all AmazonReferralFee.referralFeeCategoryNameEn for ProductCategory.productCategoryNameEn "Beauty"', async () => {
    // Find the ProductCategory with the name 'Beauty'
    const productCategory = await db.ProductCategory.findOne({
      where: { productCategoryNameEn: 'Beauty' },
      include: [
        {
          model: db.AmazonReferralFee,
          through: {
            model: db.ProductAndAmzReferralFeeCategory,
            attributes: [],
          },
        },
      ],
    });

    const referralFeeNames = productCategory.AmazonReferralFees.map(
      fee => fee.referralFeeCategoryNameEn,
    );

    expect(referralFeeNames.length).toBeGreaterThan(0);
  });
});
