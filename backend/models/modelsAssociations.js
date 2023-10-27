// module.exports = (sequelize) => { ... } defines a function that is exported from this module. 
// This function takes one argument, which is named sequelize.
// In this context, sequelize is expected to be an instance of Sequelize, 
// which typically includes a models property where all your models are registered.
module.exports = (sequelize) => {

    // Destructuring models from sequelize
    const {
        Asin,
        Brand,
        Country,
        Ean,
        ProductCategory,
        ProductCategoryRank,
        ProductTaxCategory,
        Sku,
        VatRatePerCountry
    } = sequelize.models;

    // Associations for Asin
    Asin.belongsTo(ProductCategory, {
        foreignKey: 'productCategoryId'
    });
    Asin.belongsTo(ProductCategoryRank, {
        foreignKey: 'productCategoryRankId'
    });
    Asin.belongsTo(ProductTaxCategory, {
        foreignKey: 'productTaxCategoryId'
    });
    Asin.belongsTo(Country, {
        foreignKey: 'countryCode'
    });
    Asin.belongsToMany(Ean, {
        through: "EanInAsin",
        foreignKey: 'asin',
        otherKey: 'ean'
    });
    Asin.hasMany(Sku, {
        foreignKey: 'asin'
    });

    // Associations for Brand
    Brand.hasMany(Ean, {
        foreignKey: 'brandId'
    });

    // Associations for Country
    Country.hasMany(Asin, {
        foreignKey: 'countryCode'
    });
    Country.hasMany(Sku, {
        foreignKey: 'countryCode'
    });

    // Associations for Ean
    Ean.belongsTo(Brand, {
        foreignKey: 'brandId'
    });
    Ean.belongsToMany(Asin, {
        through: "EanInAsin",
        foreignKey: 'ean',
        otherKey: 'asin'
    });

    // Associations for ProductCategory
    ProductCategory.hasMany(Asin, {
        foreignKey: 'productCategoryId'
    });

    // Associations for ProductCategoryRank
    ProductCategoryRank.belongsTo(Country, {
        foreignKey: 'countryCode'
    });
    ProductCategoryRank.belongsTo(ProductCategory, {
        foreignKey: 'productCategoryId'
    });

    // Associations for ProductTaxCategory
    ProductTaxCategory.belongsTo(Country, {
        foreignKey: 'countryCode'
    });
    ProductTaxCategory.belongsTo(VatRatePerCountry, {
        foreignKey: 'vatRateCategory'
    });

    // Associations for Sku
    Sku.belongsTo(Country, {
        foreignKey: '_country_code'
    });
    Sku.belongsTo(Asin, {
        foreignKey: 'asin'
    });

    // Associations for VatRatePerCountry
    VatRatePerCountry.belongsTo(Country, {
        foreignKey: 'countryCode'
    });
    VatRatePerCountry.hasMany(ProductTaxCategory, {
        foreignKey: 'vatRateCategory'
    });

};
