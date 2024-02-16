const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe(`AmazonReferralFee Model Tests`, () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid AmazonReferralFee
  test('Create a valid AmazonReferralFee', async () => {
    const amazonReferralFee = await db.AmazonReferralFee.create({
      countryCode: 'FR',
      referralFeeCategoryNameEn: 'Electronics',
      referralFeePercentage: 0.08,
      perItemMinimumReferralFee: 0.3,
      closingFee: 0.5,
    });

    expect(amazonReferralFee).toHaveProperty('referralFeeCategoryId');
    expect(parseFloat(amazonReferralFee.referralFeePercentage)).toBe(0.08);
  });

  // Fail to create a AmazonReferralFee (look for constraint errors or Datatype errors)
  test('Fail to create a valid AmazonReferralFee', async () => {
    await expect(
      db.AmazonReferralFee.create({
        countryCode: 'FR',
        referralFeeCategoryNameEn: 'Books',
        referralFeePercentage: 20.15, // DataTypes.DECIMAL(6, 5)
        perItemMinimumReferralFee: 0.3,
        closingFee: 0.5,
      }),
    ).rejects.toThrow();
  });

  // Update an AmazonReferralFee
  test('Update a valid AmazonReferralFee', async () => {
    let amazonReferralFee = await db.AmazonReferralFee.create({
      countryCode: 'DE',
      referralFeeCategoryNameEn: 'Books',
      referralFeePercentage: 0.15,
      perItemMinimumReferralFee: 0.3,
      closingFee: 0.5,
    });

    await amazonReferralFee.update({ referralFeePercentage: 0.1 });

    amazonReferralFee = await db.AmazonReferralFee.findByPk(
      amazonReferralFee.referralFeeCategoryId,
    );
    expect(parseFloat(amazonReferralFee.referralFeePercentage)).toBe(0.1);
  });

  // Delete an AmazonReferralFee
  test('Delete a valid AmazonReferralFee', async () => {
    const amazonReferralFee = await db.AmazonReferralFee.create({
      countryCode: 'UK',
      referralFeeCategoryNameEn: 'Toys',
      referralFeePercentage: 0.12,
      perItemMinimumReferralFee: 0.3,
      closingFee: 0.5,
    });

    await amazonReferralFee.destroy();
    const deletedAmazonReferralFee = await db.AmazonReferralFee.findByPk(
      amazonReferralFee.referralFeeCategoryId,
    );
    expect(deletedAmazonReferralFee).toBeNull();
  });

  // ASSOCIATION TESTS - only test the belongsTo and belongsToMany associations
  // belongsTo
  test('Fail to create an AmazonReferralFee due to unexisting foreign key (countryCode)', async () => {
    await expect(
      db.AmazonReferralFee.create({
        countryCode: 'ZZ', // Assuming 'ZZ' is not a valid country code in the 'countries' table
        referralFeeCategoryNameEn: 'Jewelry',
        referralFeePercentage: 0.2,
        perItemMinimumReferralFee: 0.3,
        closingFee: 0.5,
      }),
    ).rejects.toThrow();
  });

  // belongsToMany ProductCategory
  // Retrieve the ProductCategoryNameEn of AmazonReferralFee with id 6
  test('Retrieve the ProductCategoryNameEn of AmazonReferralFee with id 6', async () => {
    const amazonReferralFee = await db.AmazonReferralFee.findByPk(6, {
      include: [
        {
          model: db.ProductCategory,
          through: {
            model: db.ProductAndAmazonReferralFee,
            attributes: [],
          },
        },
      ],
    });

    const productCategoryNameEn =
      amazonReferralFee.ProductCategories[0].productCategoryNameEn;
    expect(productCategoryNameEn).toBe('Beauty');
  });
});
