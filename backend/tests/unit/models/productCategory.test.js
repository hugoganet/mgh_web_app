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
        const productCategory = await db.ProductCategory.findOne({ where: { productCategoryNameEn: 'Beauty' } });
        expect(productCategory.productCategoryNameFr).toBe('Beauté et Parfum');
    });

    
    // Association tests
    test('ProductCategory has many Asin', async () => {
        // Test for checking the association between ProductCategory and ProductTaxCategory
        const productCategory = await db.ProductCategory.findOne({ where: { productCategoryNameEn: 'Grocery' } });
        const asins = await productCategory.getAsins();
        expect(asins.length).toBeGreaterThan(0);
    });
});





