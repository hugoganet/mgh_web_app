const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`priceGridFbaFee Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid priceGridFbaFee
  test('Create a valid priceGridFbaFee', async () => {
    const newPriceGridFbaFee = await db.PriceGridFbaFee.create({
      countryCode: 'FR',
      fbaPackageCategoryName: 'test package category name',
      categoryMaxWeight: 15.0,
      categoryMaxLength: 20.0,
      categoryMaxWidth: 10.0,
      categoryMaxHeight: 5.0,
      fbaFeeLocalAndPanEu: 2.5,
      fbaFeeEfnBe: 3.0,
    });
    expect(newPriceGridFbaFee).toHaveProperty('priceGridFbaFeeId');
    expect(newPriceGridFbaFee.fbaPackageCategoryName).toBe(
      'test package category name',
    );
  });

  // Fail to create a  priceGridFbaFee (look for constraint errors or Datatype errors)
  test('Fail to create a priceGridFbaFee', async () => {
    await expect(
      db.PriceGridFbaFee.create({
        countryCode: 'FR',
        fbaPackageCategoryName: null,
        categoryMaxWeight: 15.0,
        categoryMaxLength: 20.0,
        categoryMaxWidth: 10.0,
        categoryMaxHeight: 5.0,
        fbaFeeLocalAndPanEu: 2.5,
        fbaFeeEfnBe: 3.0,
      }),
    ).rejects.toThrow();
  });

  // Update an priceGridFbaFee
  test('Update a valid priceGridFbaFee', async () => {
    const priceGridFbaFee = await db.PriceGridFbaFee.create({
      countryCode: 'FR',
      fbaPackageCategoryName: 'Original Package Category',
      categoryMaxWeight: 15.0,
      categoryMaxLength: 20.0,
      categoryMaxWidth: 10.0,
      categoryMaxHeight: 5.0,
      fbaFeeLocalAndPanEu: 2.5,
      fbaFeeEfnBe: 3.0,
    });

    await priceGridFbaFee.update({
      fbaPackageCategoryName: 'Updated Package Category',
    });

    const updatedPriceGridFbaFee = await db.PriceGridFbaFee.findByPk(
      priceGridFbaFee.priceGridFbaFeeId,
    );
    expect(updatedPriceGridFbaFee.fbaPackageCategoryName).toBe(
      'Updated Package Category',
    );
  });

  // Delete an priceGridFbaFee
  test('Delete a valid priceGridFbaFee', async () => {
    const priceGridFbaFee = await db.PriceGridFbaFee.create({
      countryCode: 'FR',
      fbaPackageCategoryName: 'Delete Package Category',
      categoryMaxWeight: 15.0,
      categoryMaxLength: 20.0,
      categoryMaxWidth: 10.0,
      categoryMaxHeight: 5.0,
      fbaFeeLocalAndPanEu: 2.5,
      fbaFeeEfnBe: 3.0,
    });

    await priceGridFbaFee.destroy();
    const deletedPriceGridFbaFee = await db.PriceGridFbaFee.findByPk(
      priceGridFbaFee.priceGridFbaFeeId,
    );
    expect(deletedPriceGridFbaFee).toBeNull();
  });

  // ASSOCIATION TESTS - only test the belongsTo and belongsToMany associations
  // belongsTo - Fail to create a priceGridFbaFee due to unexisting foreign key (Country 'US')
  test('Fail to create a priceGridFbaFee due to unexisting foreign key (Country)', async () => {
    await expect(
      db.PriceGridFbaFee.create({
        countryCode: 'US',
        fbaPackageCategoryName: 'Invalid Package Category',
        categoryMaxWeight: 15.0,
        categoryMaxLength: 20.0,
        categoryMaxWidth: 10.0,
        categoryMaxHeight: 5.0,
        fbaFeeLocalAndPanEu: 2.5,
        fbaFeeEfnBe: 3.0,
      }),
    ).rejects.toThrow();
  });
});
