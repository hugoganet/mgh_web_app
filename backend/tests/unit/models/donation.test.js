const {
  initializeTestDatabase,
  closeDatabase,
  db,
} = require('../../jest.setup');

describe(`Donation Model Tests`, () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // BASIC TESTS
  // Create a valid Donation
  test('Create a valid Donation', async () => {
    const donation = await db.Donation.create({
      warehouseId: 1,
      donationTo: 'Charity Organization',
      donationDate: new Date(),
    });
    expect(donation).toHaveProperty('donationId');
  });

  // Fail to create a Donation (look for constraint errors or Datatype errors)
  test('Fail to create a valid Donation', async () => {
    await expect(
      db.Donation.create({
        warehouseId: null, // warehouseId cannot be null
        donationTo: 'Charity Organization',
        donationDate: new Date(),
      }),
    ).rejects.toThrow();
  });

  // Update a Donation
  test('Update a valid Donation', async () => {
    const donation = await db.Donation.create({
      warehouseId: 1,
      donationTo: 'Charity Organization',
      donationDate: new Date(),
    });
    donation.donationTo = 'New Charity Organization';
    await donation.save();
    expect(donation.donationTo).toBe('New Charity Organization');
  });

  // Delete a Donation
  test('Delete a valid Donation', async () => {
    const donation = await db.Donation.create({
      warehouseId: 1,
      donationTo: 'Charity Organization',
      donationDate: new Date(),
    });
    await donation.destroy();
    const donationFound = await db.Donation.findByPk(donation.donationId);
    expect(donationFound).toBeNull();
  });

  // ASSOCIATION TESTS
  // belongsTo Warehouse
  test('Retrieve Warehouse of Donation.donationId(1)', async () => {
    // This test assumes a donation with ID 1 exists
    const donation = await db.Donation.findByPk(1, {
      include: db.Warehouse,
    });
    expect(donation).not.toBeNull();
    expect(donation).toHaveProperty('Warehouse');
  });

  test('Fail to create a donation with unexisting Warehouse', async () => {
    await expect(
      db.Donation.create({
        warehouseId: 9999, // Non-existent Warehouse ID
        donationTo: 'Charity Organization',
        donationDate: new Date(),
      }),
    ).rejects.toThrow();
  });

  // belongsToMany Ean through EanInDonation
  test('Retrieve all EAN in Donation.donationId(1)', async () => {
    // This test assumes a donation with ID 1 exists and has associated EANs
    const donation = await db.Donation.findByPk(1, {
      include: db.Ean,
    });
    // const eansData = donation.Eans.map(ean => ean.dataValues.ean);
    // console.log(`eansData => ${eansData}`);

    expect(donation).not.toBeNull();
    expect(donation.Eans).not.toHaveLength(0);
  });

  test('Fail to create a donation with unexisting EAN', async () => {
    // This test assumes the EanInDonation model exists and is correctly associated
    await expect(
      db.EanInDonation.create({
        donationId: 1,
        eanId: 9999, // Non-existent EAN ID
      }),
    ).rejects.toThrow();
  });
});
