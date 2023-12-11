const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`MinimumSellingPrice Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid MinimumSellingPrice
  test('Create a valid MinimumSellingPrice', async () => {
    const minimumSellingPrice = await db.MinimumSellingPrice.create({
      skuId: 1,
      pricingRuleId: 1,
      enrolledInPanEu: true,
      eligibleForPanEu: true,
      referralFeeCategoryId: 1,
      minimumMarginWanted: 10.0,
      minimumSellingPriceLocalAndPanEu: 15.34,
      minimumSellingPriceEfn: 20.0,
      maximumSellingPriceLocalAndPanEu: 25.0,
      maximumSellingPriceEfn: 30.0,
    });
    expect(minimumSellingPrice).toHaveProperty('minimumSellingPriceId');
  });

  // Fail to create a MinimumSellingPrice (look for constraint errors or Datatype errors)
  test('Fail to create a valid MinimumSellingPrice', async () => {
    await expect(
      db.MinimumSellingPrice.create({
        skuId: 1, // skuId has a unique constraint
        pricingRuleId: 1,
        enrolledInPanEu: true,
        eligibleForPanEu: true,
        referralFeeCategoryId: 1,
        minimumMarginWanted: 10.0,
        minimumSellingPriceLocalAndPanEu: 15.34,
        minimumSellingPriceEfn: 20.0,
        maximumSellingPriceLocalAndPanEu: 25.0,
        maximumSellingPriceEfn: 30.0,
      }),
    ).rejects.toThrow();
  });

  // Update a MinimumSellingPrice
  test('Update a valid MinimumSellingPrice', async () => {
    const minimumSellingPrice = await db.MinimumSellingPrice.create({
      skuId: 3,
      pricingRuleId: 1,
      enrolledInPanEu: true,
      eligibleForPanEu: true,
      referralFeeCategoryId: 1,
      minimumMarginWanted: 0.1,
      minimumSellingPriceLocalAndPanEu: 15.34,
      minimumSellingPriceEfn: 20.0,
      maximumSellingPriceLocalAndPanEu: 25.0,
      maximumSellingPriceEfn: 30.0,
    });
    const updated = await minimumSellingPrice.update({
      minimumSellingPriceLocalAndPanEu: 16.0,
    });
    expect(parseFloat(updated.minimumSellingPriceLocalAndPanEu)).toBe(16.0);
  });

  // Delete a MinimumSellingPrice
  test('Delete a valid MinimumSellingPrice', async () => {
    const minimumSellingPrice = await db.MinimumSellingPrice.create({
      skuId: 5,
      pricingRuleId: 1,
      enrolledInPanEu: true,
      eligibleForPanEu: true,
      referralFeeCategoryId: 1,
      minimumMarginWanted: 0.1,
      minimumSellingPriceLocalAndPanEu: 15.34,
      minimumSellingPriceEfn: 20.0,
      maximumSellingPriceLocalAndPanEu: 25.0,
      maximumSellingPriceEfn: 30.0,
    });
    const deleted = await db.MinimumSellingPrice.destroy({
      where: {
        minimumSellingPriceId: minimumSellingPrice.minimumSellingPriceId,
      },
    });
    expect(deleted).toBe(1);
  });

  // ASSOCIATION TESTS - only test the belongsTo and belongsToMany associations
  // belongsTo
  // Retrieve the minimumSellingPriceLocalAndPanEu of Sku(LBM-03.22-5,16-B00MUQCGIQ) expect(15.34)
  test('Retrieve the minimumSellingPriceLocalAndPanEu of Sku(LBM-03.22-5,16-B00MUQCGIQ) expect(15.34)', async () => {
    const sku = await db.Sku.findOne({
      where: { sku: 'LBM-03.22-5,16-B00MUQCGIQ' },
    });
    const minimumSellingPrice = await db.MinimumSellingPrice.findOne({
      where: { skuId: sku.skuId },
    });
    expect(
      parseFloat(minimumSellingPrice.minimumSellingPriceLocalAndPanEu),
    ).toBe(15.34);
  });

  // Retrieve all the Sku where pricingRuleId(1)
  test('Retrieve all the Sku where pricingRuleId(1)', async () => {
    const minimumSellingPrices = await db.MinimumSellingPrice.findAll({
      where: { pricingRuleId: 1 },
      include: db.Sku,
    });
    const skus = minimumSellingPrices.map(msp => msp.Sku);
    expect(skus.length).toBeGreaterThan(0);
  });

  // Fail to create a MinimumSellingPrice due to unexisting foreign key (AmazonReferralFee)
  test('Fail to create a MinimumSellingPrice due to unexisting foreign key (AmazonReferralFee)', async () => {
    await expect(
      db.MinimumSellingPrice.create({
        skuId: 3,
        pricingRuleId: 1,
        enrolledInPanEu: true,
        eligibleForPanEu: true,
        referralFeeCategoryId: 9991, // Invalid referralFeeCategoryId
        minimumMarginWanted: 0.1,
        minimumSellingPriceLocalAndPanEu: 15.34,
        minimumSellingPriceEfn: 20.0,
        maximumSellingPriceLocalAndPanEu: 25.0,
        maximumSellingPriceEfn: 30.0,
      }),
    ).rejects.toThrow();
  });
});
