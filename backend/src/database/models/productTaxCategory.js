// ProductTaxCategory.js
const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class ProductTaxCategory
   * @extends Model
   * @classdesc Create a ProductTaxCategory class
   */
  class ProductTaxCategory extends Model {}

  ProductTaxCategory.init(
    {
      productTaxCategoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      countryCode: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      productTaxCategoryName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      productTaxCategoryDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      vatCategoryId: {
        type: DataTypes.STRING(2),
        allowNull: false,
        references: {
          model: 'vat_categories',
          key: 'vat_category_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ProductTaxCategory',
      tableName: 'product_tax_categories',
      timestamps: false,
    },
  );

  return ProductTaxCategory;
};
