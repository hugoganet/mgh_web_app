const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class PriceGridFbaFee
   * @extends Model
   * @classdesc Represents the FBA fee structure for different package categories and country codes.
   */
  class PriceGridFbaFee extends Model {}

  PriceGridFbaFee.init(
    {
      priceGridFbaFeeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      countryCode: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      fbaPackageCategoryName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      categoryMaxWeight: {
        type: DataTypes.DECIMAL(10, 2),
      },
      categoryMaxLength: {
        type: DataTypes.DECIMAL(10, 2),
      },
      categoryMaxWidth: {
        type: DataTypes.DECIMAL(10, 2),
      },
      categoryMaxHeight: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFeeLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFeeEfn: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFeeLowPriceLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFeeLowPriceEfn: {
        type: DataTypes.DECIMAL(10, 2),
      },
      lowPriceSellingPriceThresholdInc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      currencyCode: {
        type: DataTypes.CHAR(3),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PriceGridFbaFee',
      tableName: 'price_grid_fba_fees',
      timestamps: false,
    },
  );

  return PriceGridFbaFee;
};
