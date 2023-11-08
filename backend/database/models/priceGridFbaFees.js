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
        type: DataTypes.DECIMAL,
      },
      categoryMaxLength: {
        type: DataTypes.DECIMAL,
      },
      categoryMaxWidth: {
        type: DataTypes.DECIMAL,
      },
      categoryMaxHeight: {
        type: DataTypes.DECIMAL,
      },
      fbaFeeLocalAndPanEu: {
        type: DataTypes.DECIMAL,
      },
      fbaFeeEfnBe: {
        type: DataTypes.DECIMAL,
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
