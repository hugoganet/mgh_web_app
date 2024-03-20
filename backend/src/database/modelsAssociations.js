module.exports = db => {
  // Destructuring models from db
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
    AfnInventoryDailyUpdate,
    FbaSaleProcessed,
    SellingPriceHistory,
    AfnRemovalOrders,
  } = db;

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
  Asin.belongsTo(ProductTaxCategory, {
    foreignKey: 'productTaxCategoryId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
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
  Country.hasMany(FbaSaleProcessed, {
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
  Ean.hasMany(EanInSupplierOrder, {
    foreignKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Ean.hasMany(EanInDonation, {
    foreignKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Ean.hasMany(WarehouseStock, {
    foreignKey: 'ean',
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
  Sku.hasMany(AfnInventoryDailyUpdate, {
    foreignKey: 'skuId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Sku.hasMany(FbaSaleProcessed, {
    foreignKey: 'skuId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Sku.hasMany(SellingPriceHistory, {
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
  SupplierOrder.belongsToMany(Ean, {
    through: EanInSupplierOrder,
    foreignKey: 'supplierOrderId',
    otherKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for Warehouse
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
  Warehouse.hasMany(AfnRemovalOrders, {
    foreignKey: 'warehouseId',
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

  // Associations for Donation
  Donation.belongsToMany(Ean, {
    through: EanInDonation,
    foreignKey: 'donationId',
    otherKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  Donation.belongsTo(Warehouse, {
    foreignKey: 'warehouseId',
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
  WarehouseStock.belongsTo(Ean, {
    foreignKey: 'ean',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for AfnInventoryDailyUpdate
  AfnInventoryDailyUpdate.belongsTo(Sku, {
    foreignKey: 'skuId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for FbaSaleProcessed
  FbaSaleProcessed.belongsTo(Sku, {
    foreignKey: 'skuId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  FbaSaleProcessed.belongsTo(Country, {
    foreignKey: 'countryCode',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for SellingPriceHistory
  SellingPriceHistory.belongsTo(Sku, {
    foreignKey: 'skuId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  // Associations for AfnRemovalOrders
  AfnRemovalOrders.belongsTo(Warehouse, {
    foreignKey: 'warehouseId',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
};
