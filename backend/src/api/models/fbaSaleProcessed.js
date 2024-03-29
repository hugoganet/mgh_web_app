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
      salesSkuQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salesFbaFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      salesPurchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      salesCogs: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      salesGrossMarginTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      salesGrossMarginPerItem: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      salesGrossMarginPercentagePerItem: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      salesNetMarginTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      salesNetMarginPerItem: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      salesNetMarginPercentagePerItem: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      salesRoiPerItem: {
        type: DataTypes.DECIMAL(10, 5),
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
