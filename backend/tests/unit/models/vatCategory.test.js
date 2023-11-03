const { initializeDatabase, closeDatabase, db } = require('../../jest.setup'); 

describe(`VatCategory Model Tests`, () => {
    beforeAll(async () => {
        await initializeDatabase();
    });     

    afterAll(async () => {
        await closeDatabase();
    });

    // Basic tests for creating, updating, deleting, and retrieving data
    test('Select a valid VatCategory', async () => {
        // Test for select a valid category
        const vatCategory = await db.VatCategory.findOne({ where: { vatCategoryId: 'S' } });
        expect(vatCategory.vatCategoryDefinition).toBe('Standard');
    });

    
    // Association tests
    test('VatCategory has many ProductTaxCategory', async () => {
        // Test for checking the association between vatCategory and ProductTaxCategory
        const vatCategory = await db.VatCategory.findOne({ where: { vatCategoryId: 'Z' }});
        const productTaxCategory = await vatCategory.getProductTaxCategories();
        expect(productTaxCategory.length).toBeGreaterThan(0);
    });

    test('VatCategory has many VatRatePerCountry', async () => {
        // Test for checking the association between vatCategory and ProductTaxCategory
        const vatCategory = await db.VatCategory.findOne({ where: { vatCategoryId: 'Z' }});
        const vatRatePerCountry = await vatCategory.getVatRatePerCountries();
        expect(vatRatePerCountry.length).toBeGreaterThan(0);
    });

});





