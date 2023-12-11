const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`FbaFee Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS

  // Fail to create a FbaFee (look for constraint errors or Datatype errors)
  test('Fail to create a valid FbaFee', async () => {
    await expect(
      db.FbaFee.create({
        asinId: 1, // AsinId must be unique
        packageLength: 10.0,
        packageWidth: 10.0,
        packageHeight: 10.0,
        packageWeight: 2.5,
        priceGridFbaFeeId: 1,
      }),
    ).rejects.toThrow();
  });

  // Update an FbaFee
  test('Update a valid FbaFee', async () => {
    const fbaFee = await db.FbaFee.findByPk(1100);
    const updated = await fbaFee.update({
      packageWeight: 3.0,
    });
    expect(updated.packageWeight).toBe(3.0);
  });

  // Delete an FbaFee
  test('Delete a valid FbaFee', async () => {
    const fbaFee = await db.FbaFee.findByPk(1000);
    const deleted = await db.FbaFee.destroy({
      where: { fbaFeeId: fbaFee.fbaFeeId },
    });
    expect(deleted).toBe(1);
  });

  // ASSOCIATION TESTS
  // belongsTo Asin
  test('Retrieve the priceGridFbaFeeId of Asin(2012272320) expect(9)', async () => {
    const asin = await db.Asin.findOne({ where: { asin: '2012272320' } });
    expect(asin).not.toBeNull();
    expect(asin).toHaveProperty('asinId');

    const fbaFee = await db.FbaFee.findOne({
      where: { asinId: asin.asinId },
      include: [db.Asin],
    });

    expect(fbaFee).not.toBeNull();
    expect(fbaFee).toHaveProperty('priceGridFbaFeeId');
    expect(parseFloat(fbaFee.priceGridFbaFeeId)).toBe(9);
  });

  // belongsTo PriceGridFbaFee
  test('Retrieve the fbaFeesLocalAndPanEu of priceGridFbaFeeId(9) expect(5.92)', async () => {
    const priceGridFbaFee = await db.PriceGridFbaFee.findByPk(9);
    const fbaFees = await db.FbaFee.findAll({
      where: { priceGridFbaFeeId: priceGridFbaFee.priceGridFbaFeeId },
      include: [db.PriceGridFbaFee],
    });
    // Check if all fbaFees have a PriceGridFbaFee with fbaFeeLocalAndPanEu equal to 5.92
    expect(
      fbaFees.every(
        fee =>
          fee.PriceGridFbaFee &&
          parseFloat(fee.PriceGridFbaFee.fbaFeeLocalAndPanEu) === 5.92,
      ),
    ).toBe(true);
  });
});
