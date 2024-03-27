const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing an Amazon removal order.
   */
  class AfnRemovalOrdersDetails extends Model {}

  AfnRemovalOrdersDetails.init(
    {
      afnRemovalOrderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      afnRemovalOrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'afn_removal_orders',
          key: 'afn_removal_order_id',
        },
      },
      skuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      fnsku: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      disposition: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      requestedQuantity: {
        type: DataTypes.INTEGER,
      },
      cancelledQuantity: {
        type: DataTypes.INTEGER,
      },
      disposedQuantity: {
        type: DataTypes.INTEGER,
      },
      shippedQuantity: {
        type: DataTypes.INTEGER,
      },
      inProcessQuantity: {
        type: DataTypes.INTEGER,
      },
      removalFee: {
        type: DataTypes.DECIMAL(10, 2),
      },
      currency: {
        type: DataTypes.CHAR(3),
      },
    },
    {
      sequelize,
      modelName: 'AfnRemovalOrdersDetails',
      tableName: 'afn_removal_orders_details',
      timestamps: false,
    },
  );

  return AfnRemovalOrdersDetails;
};
