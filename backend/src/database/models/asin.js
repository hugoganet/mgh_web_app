const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class Asin
   * @extends Model
   * @classdesc Create a Asin class
   */
  class Asin extends Model {}

  Asin.init(
    {
      asinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      asin: {
        type: DataTypes.STRING(10),
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
      productCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      productCategoryRankId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'product_categories_ranks',
          key: 'product_category_rank_id',
        },
      },
      productTaxCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'product_tax_categories',
          key: 'product_tax_category_id',
        },
      },
      asinPreparation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      urlAmazon: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      urlImage: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      asinName: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      asinPotentialWarehouseQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      asinNumberOfActiveSku: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      asinAverageUnitSoldPerDay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      isBatteryRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isHazmat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isLawLang: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Asin',
      tableName: 'asins',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['asin', 'country_code'],
        },
      ],
    },
  );

  return Asin;
};
