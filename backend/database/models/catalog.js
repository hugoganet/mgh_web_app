// catalog.js
const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class Catalog
   * @extends Model
   * @classdesc Represents a product entry in the catalog with its details.
   */
  class Catalog extends Model {}

  Catalog.init(
    {
      catalogId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      supplierEan: {
        type: DataTypes.STRING(13),
        allowNull: false,
      },
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'supplier_id',
        },
      },
      supplierPartNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'brands',
          key: 'brand_id',
        },
      },
      unitPackSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productPriceExc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      productVatRate: {
        type: DataTypes.DECIMAL(6, 5),
        allowNull: false,
      },
      catalogEntryLastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Catalog',
      tableName: 'catalog',
    },
  );

  return Catalog;
};
