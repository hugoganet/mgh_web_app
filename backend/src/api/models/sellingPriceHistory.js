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
      currency: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SellingPriceHistory',
      tableName: 'selling_prices_history',
    },
  );

  return SellingPricesHistory;
};
