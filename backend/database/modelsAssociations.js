// module.exports = (sequelize) => { ... } defines a function that is exported from this module.
// This function takes one argument, which is named sequelize.
// In this context, sequelize is expected to be an instance of Sequelize,

// which typically includes a models property where all your models are registered.
module.exports = sequelize => {
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
    AsinSku,
    AmazonReferralFee,
    PriceGridFbaFee,
    Supplier,
    SupplierOrder,
    Warehouse,
    MinimumSellingPrice,
    PricingRule,
    FbaFee,
    Catalog,
    SupplierBrandCatalog,
    EanInSupplierOrder,
    Donation,
    EanInDonation,
    WarehouseStock,
    ProductAndAmzReferralFeeCategory,
  } = sequelize.models;

  // Associations for Asin
  Asin.belongsTo(ProductCategory, {
    foreignKey: 'productCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Asin.belongsTo(ProductCategoryRank, {
    foreignKey: 'productCategoryRankId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Asin.belongsTo(
    ProductTaxCategory,
    { targetKey: 'productTaxCategoryId', foreignKey: 'productTaxCategoryName' },
    { onDelete: 'NO ACTION', onUpdate: 'CASCADE' },
  );
  Asin.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Asin.belongsToMany(Ean, {
    through: EanInAsin,
    foreignKey: 'asinId',
    otherKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Asin.belongsToMany(Sku, {
    through: AsinSku,
    foreignKey: 'asinId',
    otherKey: 'skuId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Asin.hasMany(FbaFee, {
    foreignKey: 'asinId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for Brand
  Brand.hasMany(Ean, {
    foreignKey: 'brandId',
  });
  Brand.hasMany(Catalog, {
    foreignKey: 'brandId',
  });
  Brand.belongsToMany(Supplier, {
    through: SupplierBrandCatalog,
    foreignKey: 'brandId',
    otherKey: 'supplierId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for Country
  Country.hasMany(Asin, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Country.hasMany(Sku, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Country.hasMany(VatRatePerCountry, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Country.hasMany(ProductTaxCategory, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Country.hasMany(ProductCategoryRank, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Country.hasMany(AmazonReferralFee, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Country.hasMany(PriceGridFbaFee, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Country.hasMany(Supplier, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Country.hasMany(Warehouse, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for Ean
  Ean.belongsTo(Brand, {
    foreignKey: 'brandId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Ean.belongsToMany(Asin, {
    through: EanInAsin,
    foreignKey: 'ean',
    otherKey: 'asinId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  // Ean.belongsToMany(Supplier, {
  //   through: Catalog,
  //   foreignKey: 'ean',
  //   otherKey: 'supplierId',
  //   onDelete: 'NO ACTION',
  //   onUpdate: 'CASCADE',
  // });
  Ean.belongsToMany(SupplierOrder, {
    through: EanInSupplierOrder,
    foreignKey: 'ean',
    otherKey: 'supplierOrderId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Ean.belongsToMany(Donation, {
    through: EanInDonation,
    foreignKey: 'ean',
    otherKey: 'donationId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Ean.belongsToMany(Warehouse, {
    through: WarehouseStock,
    foreignKey: 'ean',
    otherKey: 'warehouseId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for ProductCategory
  ProductCategory.hasMany(Asin, {
    foreignKey: 'productCategoryId',
  });
  ProductCategory.hasMany(ProductCategoryRank, {
    foreignKey: 'productCategoryId',
  });
  ProductCategory.belongsToMany(AmazonReferralFee, {
    through: ProductAndAmzReferralFeeCategory,
    foreignKey: 'productCategoryId',
    otherKey: 'referralFeeCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  ProductCategory.hasMany(Supplier, {
    foreignKey: 'productCategoryId',
  });

  // Associations for ProductCategoryRank
  ProductCategoryRank.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  ProductCategoryRank.belongsTo(ProductCategory, {
    foreignKey: 'productCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  ProductCategoryRank.hasMany(Asin, {
    foreignKey: 'productCategoryRankId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for ProductTaxCategory
  ProductTaxCategory.belongsTo(VatCategory, {
    foreignKey: 'vatCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  ProductTaxCategory.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
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
    onUpdate: 'CASCADE',
  });
  VatRatePerCountry.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
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
    onUpdate: 'CASCADE',
  });
  Sku.belongsToMany(Asin, {
    through: AsinSku,
    foreignKey: 'skuId',
    otherKey: 'asinId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Sku.hasMany(MinimumSellingPrice, {
    foreignKey: 'skuId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for AmazonReferralFee
  AmazonReferralFee.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  AmazonReferralFee.belongsToMany(ProductCategory, {
    through: ProductAndAmzReferralFeeCategory,
    foreignKey: 'referralFeeCategoryId',
    otherKey: 'productCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  AmazonReferralFee.hasMany(MinimumSellingPrice, {
    foreignKey: 'referralFeeCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for PriceGridFbaFee
  PriceGridFbaFee.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  PriceGridFbaFee.hasMany(FbaFee, {
    foreignKey: 'priceGridFbaFeeId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for Supplier
  Supplier.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Supplier.belongsTo(ProductCategory, {
    foreignKey: 'productCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Supplier.hasMany(SupplierOrder, {
    foreignKey: 'supplierId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  // Supplier.belongsToMany(Ean, {
  //   through: Catalog,
  //   foreignKey: 'supplierId',
  //   otherKey: 'ean',
  //   onDelete: 'NO ACTION',
  //   onUpdate: 'CASCADE',
  // });
  Supplier.belongsToMany(Brand, {
    through: SupplierBrandCatalog,
    foreignKey: 'supplierId',
    otherKey: 'brandId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for SupplierOrder
  SupplierOrder.belongsTo(Supplier, {
    foreignKey: 'supplierId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  SupplierOrder.belongsTo(Warehouse, {
    foreignKey: 'warehouseId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  // SupplierOrder.belongsToMany(Catalog, {
  //   through: EanInSupplierOrder,
  //   foreignKey: 'supplierOrderId',
  //   otherKey: 'catalogId',
  //   onDelete: 'NO ACTION',
  //   onUpdate: 'CASCADE',
  // });
  SupplierOrder.belongsToMany(Ean, {
    through: EanInSupplierOrder,
    foreignKey: 'supplierOrderId',
    otherKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for Warehouse
  Warehouse.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Warehouse.hasMany(SupplierOrder, {
    foreignKey: 'warehouseId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Warehouse.belongsToMany(Ean, {
    through: WarehouseStock,
    foreignKey: 'warehouseId',
    otherKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for MinimumSellingPrice
  MinimumSellingPrice.belongsTo(Sku, {
    foreignKey: 'skuId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  MinimumSellingPrice.belongsTo(PricingRule, {
    foreignKey: 'pricingRuleId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  MinimumSellingPrice.belongsTo(AmazonReferralFee, {
    foreignKey: 'referralFeeCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for PricingRule
  PricingRule.hasMany(MinimumSellingPrice, {
    foreignKey: 'pricingRuleId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for FbaFee
  FbaFee.belongsTo(Asin, {
    foreignKey: 'asinId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  FbaFee.belongsTo(PriceGridFbaFee, {
    foreignKey: 'priceGridFbaFeeId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for Catalog
  Catalog.belongsTo(Supplier, {
    foreignKey: 'supplierId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Catalog.belongsTo(Brand, {
    foreignKey: 'brandId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  // Catalog.belongsToMany(SupplierOrder, {
  //   through: EanInSupplierOrder,
  //   foreignKey: 'catalogId',
  //   otherKey: 'supplierOrderId',
  //   onDelete: 'NO ACTION',
  //   onUpdate: 'CASCADE',
  // });

  // Associations for Donation
  Donation.belongsToMany(Ean, {
    through: EanInDonation,
    foreignKey: 'donationId',
    otherKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for EanInDonation
  EanInDonation.belongsTo(Donation, {
    foreignKey: 'donationId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for EanInSupplierOrder
  EanInSupplierOrder.belongsTo(SupplierOrder, {
    foreignKey: 'supplierOrderId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  EanInSupplierOrder.belongsTo(Ean, {
    foreignKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for WarehouseStock
  WarehouseStock.belongsTo(Warehouse, {
    foreignKey: 'warehouseId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  WarehouseStock.belongsTo(EanInSupplierOrder, {
    foreignKey: 'eanSupplierOrderId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
};
