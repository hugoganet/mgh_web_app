const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe(`VatRatePerCountry Model Tests`, () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // Basic tests for creating, updating, deleting, and retrieving data
  test('Select a valid VatRatePerCountry', async () => {
    const expectedVatRate = 0.2;
    const vatRatePerCountry = await db.VatRatePerCountry.findByPk(1);
    expect(parseFloat(vatRatePerCountry.vatRate)).toBe(expectedVatRate);
  });

  // Association tests
  test('VatRatePerCountry belongsTo VatCategory', async () => {
    const vatRatePerCountry = await db.VatRatePerCountry.findAll({
      where: { vatCategoryId: 'Z' },
    });
    expect(vatRatePerCountry.length).toBeGreaterThan(0);
  });

  test('VatRatePerCountry belongsTo Country', async () => {
    const vatRatePerCountry = await db.VatRatePerCountry.findAll({
      where: { countryCode: 'FR' },
    });
    expect(vatRatePerCountry.length).toBeGreaterThan(0);
  });
});
