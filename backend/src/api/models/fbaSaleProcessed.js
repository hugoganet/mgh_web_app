const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class FbaSaleProcessed
   * @extends Model
   * @classdesc Create a FbaSaleProcessed class
   */
  class FbaSaleProcessed extends Model {}

  FbaSaleProcessed.init(
    {
      fbaSaleProcessedId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sku: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      countryCode: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      amazonSalesId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      salesShipCountryCode: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      salesItemSellingPriceExc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      salesItemVatRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      salesSkuQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salesFbaFees: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      salesPurchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      salesGrossMarginTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      salesGrossMarginPerItem: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      salesGrossMarginPercentagePerItem: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      salesNetMarginTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      salesNetMarginPerItem: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      salesNetMarginPercentagePerItem: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      salesRoiPerItem: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FbaSaleProcessed',
      tableName: 'fba_sales_processed',
    },
  );

  return FbaSaleProcessed;
};
