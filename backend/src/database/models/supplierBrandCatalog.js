const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class SupplierBrandCatalog
   * @extends Model
   * @classdesc Represents SupplierBrandCatalogs with various contact and category details.
   */
  class SupplierBrandCatalog extends Model {}

  SupplierBrandCatalog.init(
    {
      supplierBrandCatalogId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      brandId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'brands',
          key: 'brand_id',
        },
      },
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'supplier_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'SupplierBrandCatalog',
      tableName: 'suppliers_brands_catalog',
      timestamps: false,
    },
  );

  return SupplierBrandCatalog;
};
