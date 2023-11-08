const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`PricingRule Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid PricingRule
  test('Create a valid PricingRule', async () => {
    const createdPricingRule = await db.PricingRule.create({
      pricingRuleName: 'Test PricingRule',
      pricingRuleDescription: 'Test PricingRule Description',
      pricingRuleMinimumRoi: 0.5,
      pricingRuleMinimumMargin: 0.1,
    });
    expect(parseFloat(createdPricingRule.pricingRuleMinimumRoi)).toBe(0.5);
  });

  // Fail to create a PricingRule with invalid data
  test('Fail to create a PricingRule with invalid data', async () => {
    await expect(
      db.PricingRule.create({
        pricingRuleName: null, // pricingRuleName is required and cannot be null
        pricingRuleDescription: 'Test PricingRule Description',
        pricingRuleMinimumRoi: 0.5,
        pricingRuleMinimumMargin: 0.1,
      }),
    ).rejects.toThrow();
  });

  // Update a PricingRule
  test('Update a PricingRule', async () => {
    const createdPricingRule = await db.PricingRule.create({
      pricingRuleName: 'Test PricingRule',
      pricingRuleDescription: 'Test PricingRule Description',
      pricingRuleMinimumRoi: 0.5,
      pricingRuleMinimumMargin: 0.1,
    });
    const updatedPricingRule = await createdPricingRule.update({
      pricingRuleName: 'Updated PricingRule',
    });
    expect(updatedPricingRule.pricingRuleName).toBe('Updated PricingRule');
  });

  // Delete a PricingRule
  test('Delete a PricingRule', async () => {
    const createdPricingRule = await db.PricingRule.create({
      pricingRuleName: 'Test PricingRule',
      pricingRuleDescription: 'Test PricingRule Description',
      pricingRuleMinimumRoi: 0.5,
      pricingRuleMinimumMargin: 0.1,
    });
    await createdPricingRule.destroy();
    await expect(
      db.PricingRule.findByPk(createdPricingRule.pricingRuleId),
    ).resolves.toBeNull();
  });
});
