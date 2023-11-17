const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing the Amazon referral fee for a product category in a country.
   */
  class AfnInventoryDailyUpdate extends Model {}

  AfnInventoryDailyUpdate.init(
    {
      afnInventoryDailyUpdateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
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
      actualPrice: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      afnFulfillableQuantity: {
        type: DataTypes.INTEGER,
      },
      reportDocumentId: {
        type: DataTypes.STRING(250),
      },
    },
    {
      sequelize,
      modelName: 'AfnInventoryDailyUpdate',
      tableName: 'afn_inventory_daily_updates',
      timestamps: true,
    },
  );

  return AfnInventoryDailyUpdate;
};
