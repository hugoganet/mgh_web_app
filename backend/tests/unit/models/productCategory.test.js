const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`ProductCategory Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
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
  // retrieve all AmazonReferralFee.referralFeeCategoryNameEn for a ProductCategory.productCategoryNameEn('Beauty')
  test('retrieve all AmazonReferralFee.referralFeeCategoryNameEn for ProductCategory.productCategoryNameEn "Beauty"', async () => {
    // Find the ProductCategory with the name 'Beauty'
    const productCategory = await db.ProductCategory.findOne({
      where: { productCategoryNameEn: 'Beauty' },
      include: [
        {
          model: db.AmazonReferralFee,
          through: {
            model: db.ProductAndAmzReferralFeeCategory, // The join table model
            attributes: [], // You can specify attributes if you want to include them from the join table
          },
        },
      ],
    });

    // Extract the referralFeeCategoryNameEn from each associated AmazonReferralFee
    const referralFeeNames = productCategory.AmazonReferralFees.map(
      fee => fee.referralFeeCategoryNameEn,
    );

    console.log(referralFeeNames);
    // Add appropriate expectations for your test
    // For example, you can check if the array is not empty
    expect(referralFeeNames.length).toBeGreaterThan(0);
    // If you expect specific referral fee names, you can check for those
    // expect(referralFeeNames).toContain('SpecificName');
  });
});
