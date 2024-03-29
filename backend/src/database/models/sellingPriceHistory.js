const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class SellingPricesHistory
   * @extends Model
   * @classdesc Create a SellingPricesHistory class
   */
  class SellingPricesHistory extends Model {}

  SellingPricesHistory.init(
    {
      sellingPriceHistoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      skuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      dailyPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currencyCode: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SellingPriceHistory',
      tableName: 'selling_prices_history',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['sku_id', 'date'],
        },
      ],
    },
  );

  return SellingPricesHistory;
};
