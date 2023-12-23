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
      skuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      countryCode: {
        type: DataTypes.CHAR(2),
        allowNull: true,
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
      salesItemCurrency: {
        type: DataTypes.CHAR(3),
        allowNull: false,
      },
      salesItemVatRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      salesSkuQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salesFbaFees: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      salesPurchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      salesGrossMarginTotal: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salesGrossMarginPerItem: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salesGrossMarginPercentagePerItem: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salesNetMarginTotal: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salesNetMarginPerItem: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salesNetMarginPercentagePerItem: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salesRoiPerItem: {
        type: DataTypes.FLOAT,
        allowNull: true,
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
