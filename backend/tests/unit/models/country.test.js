const { initializeDatabase, closeDatabase, db } = require('../../jest.setup'); 

describe(`Country Model Tests`, () => {
    beforeAll(async () => {
        await initializeDatabase();
    });     

    afterAll(async () => {
        await closeDatabase();
    });


    // Basic tests for creating, updating, deleting, and retrieving data
    test('Create a valid Country', async () => {
        // Test for creating a new instance
        const country = await db.Country.create({ countryCode: 'US', countryName: 'United States' });
        expect(country.countryCode).toBe('US');
        expect(country.countryName).toBe('United States');
    });

    test('Fail to create a Country with invalid data', async () => {
        // Test for handling invalid data (e.g., missing countryCode or countryName)
        await expect(db.Country.create({ countryName: null })).rejects.toThrow(); // Assuming countrName is required
        await expect(db.Country.create({ countryCode: null })).rejects.toThrow(); // Assuming countryCode is required
    });

    test('Update a Country', async () => {
        // Test for updating an instance
        const country = await db.Country.findByPk('US');
        country.countryName = 'United States of America';
        await country.save();
        expect(country.countryName).toBe('United States of America');
    });


    test('Fail to update a Country with invalid data', async () => {
        const country = await db.Country.findByPk('US');
        try {
            await country.update({ countryCode: null });
        } catch (error) {
            console.log(error);  // Log the error to see what's happening
        }
        expect(country).toHaveProperty('countryCode', 'US');  // Assuming the update should fail and the countryCode should remain 'US'
    });
    
    test('Delete a Country', async () => {
        // Test for deleting an instance
        const country = await db.Country.findByPk('US');
        await country.destroy();
        const deletedCountry = await db.Country.findByPk('US');
        expect(deletedCountry).toBeNull();
    });

    test('Fail to delete a Country with invalid data', async () => {    
        // Test for handling invalid data (e.g., missing countryCode or countryName)
        const country = await db.Country.findByPk('UK');
        await expect(country.destroy()).rejects.toThrow(); // Assuming countryCode is required
    });

    
    // Association tests
    test('Query Asin by countryCode', async () => {
        const expectedCountryCode = 'FR';
        const asins = await db.Asin.findAll({ where: { countryCode: expectedCountryCode } });
        asins.forEach(asin => {
          expect(asin.countryCode).toBe(expectedCountryCode);
        });
      });
    
    test('Query Sku by countryCode', async () => {
    const expectedCountryCode = 'FR';
    const skus = await db.Sku.findAll({ where: { countryCode: expectedCountryCode } });
    skus.forEach(sku => {
        expect(sku.countryCode).toBe(expectedCountryCode);
    });
    });

    test('Query VatRatePerCountry by vatCategoryId and countryCode', async () => {
    const expectedVatRate = 0.20000;
    const vatRate = await db.VatRatePerCountry.findOne({
        where: {
        vatCategoryId: 'S',
        countryCode: 'FR'
        }
    });
    expect(parseFloat(vatRate.vatRate)).toBe(expectedVatRate);
    });

    test('Query ProductCategoryRank by productCategoryId, countryCode, and rankingThreshold', async () => {
    const expectedRankingThresholdPercentage = 0.00100;
    const productCategoryRank = await db.ProductCategoryRank.findOne({
        where: {
        productCategoryId: 1,
        countryCode: 'FR',
        rankingThreshold: 3951
        }
    });
    expect(parseFloat(productCategoryRank.rankingThresholdPercentage)).toBe(expectedRankingThresholdPercentage);
    });

    test('Query ProductTaxCategory by productTaxCategoryName and countryCode', async () => {
    const expectedVatCategoryId = 'R2';
    const productTaxCategory = await db.ProductTaxCategory.findOne({
        where: {
        productTaxCategoryName: 'A_BOOKS_GEN',
        countryCode: 'FR'
        }
    });
    expect(productTaxCategory.vatCategoryId).toBe(expectedVatCategoryId);
    });

});





