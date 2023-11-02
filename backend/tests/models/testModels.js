// Importing the db object from the testIndex.js file :
const db = require('../testIndex');


describe('Asin Associations', () => {
    // Testing association with ProductCategory
    test('Asin belongs to ProductCategory', async () => {
        const productCategoryInstance = await ProductCategory.create({ /* ... */ });
        const asinInstance = await Asin.create({ /* ... */, productCategoryId: productCategoryInstance.id });

        expect(asinInstance.productCategoryId).toBe(productCategoryInstance.id);
    });

    // Similarly, you can add tests for other associations like ProductCategoryRank, ProductTaxCategory, Country, etc.
});
