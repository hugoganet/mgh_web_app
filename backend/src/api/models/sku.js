const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class Sku
   * @extends Model
   * @classdesc Create a Sku class
   */
  class Sku extends Model {}

  Sku.init(
    {
      skuId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      sku: {
        type: DataTypes.STRING(100),
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
      fnsku: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      skuAcquisitionCostExc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      skuAcquisitionCostInc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      skuAfnTotalQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      skuAverageSellingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      skuAverageNetMargin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      skuAverageNetMarginPercentage: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      skuAverageReturnOnInvestmentRate: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      skuAverageDailyReturnOnInvestmentRate: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      numberOfActiveDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      numberOfUnitSold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skuAverageUnitSoldPerDay: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      skuRestockAlertQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      skuIsTest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Sku',
      tableName: 'skus',
    },
  );

  return Sku;
};
