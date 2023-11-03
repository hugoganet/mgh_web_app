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
        VatCategory,
        VatRatePerCountry,
        EanInAsin,
    } = sequelize.models;

    // Associations for Asin
    Asin.belongsTo(ProductCategory, {
        foreignKey: 'productCategoryId',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    Asin.belongsTo(ProductCategoryRank, {
        foreignKey: 'productCategoryRankId',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    Asin.belongsTo(ProductTaxCategory, 
        { targetKey: 'productTaxCategoryId', foreignKey: 'productTaxCategoryName'},
        { onDelete: 'NO ACTION', onUpdate: 'CASCADE' }
    );
    Asin.belongsTo(Country, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    Asin.belongsToMany(Ean,
        { through: EanInAsin},
        {onDelete: 'NO ACTION'},
        {onUpdate: 'CASCADE'}
    );
    Asin.belongsToMany(Sku, 
        { through: "AsinSku"},
        {onDelete: 'NO ACTION'},
        {onUpdate: 'CASCADE'}
    );

    // Associations for Brand
    Brand.hasMany(Ean, {
        foreignKey: 'brandId',
        }
    );

    // Associations for Country
    Country.hasMany(Asin, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    Country.hasMany(Sku, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    Country.hasMany(VatRatePerCountry, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    Country.hasMany(ProductTaxCategory, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    Country.hasMany(ProductCategoryRank, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Associations for Ean
    Ean.belongsTo(Brand, {
        foreignKey: 'brandId',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    Ean.belongsToMany(Asin, 
        {through: EanInAsin },
        {onDelete: 'NO ACTION'},
        {onUpdate: 'CASCADE'}
    );

    // Associations for ProductCategory
    ProductCategory.hasMany(Asin, {
        foreignKey: 'productCategoryId'
        }
    );

    // Associations for ProductCategoryRank
    ProductCategoryRank.belongsTo(Country, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    ProductCategoryRank.belongsTo(ProductCategory, {
        foreignKey: 'productCategoryId',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    ProductCategoryRank.hasMany(Asin, {
        foreignKey: 'productCategoryRankId',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );

   // Associations for ProductTaxCategory
    ProductTaxCategory.belongsTo(VatCategory, {
        foreignKey: 'vatCategoryId',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    ProductTaxCategory.belongsTo(Country, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    ProductTaxCategory.hasMany(Asin, {
        foreignKey: 'productTaxCategoryId',
        sourceKey: 'productTaxCategoryId', 
        foreignKey: 'productTaxCategoryName',
    });


    // Associations for VatRatePerCountry
    VatRatePerCountry.belongsTo(VatCategory, {
        foreignKey: 'vatCategoryId',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    VatRatePerCountry.belongsTo(Country, { 
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Associations for VatCategory
    VatCategory.hasMany(ProductTaxCategory, {
        foreignKey: 'vatCategoryId',
    });
    VatCategory.hasMany(VatRatePerCountry, {
        foreignKey: 'vatCategoryId',
    });

    // Associations for Sku
    Sku.belongsTo(Country, {
        foreignKey: 'countryCode',
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
        }
    );
    Sku.belongsToMany(Asin, 
        {through: 'AsinSku'},
        {onDelete: 'NO ACTION'},
        {onUpdate: 'CASCADE'}
    );

};
