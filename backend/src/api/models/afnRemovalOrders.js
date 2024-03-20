const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing an Amazon removal order.
   */
  class AfnRemovalOrders extends Model {}

  AfnRemovalOrders.init(
    {
      afnRemovalOrderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      orderSource: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      orderStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      lastUpdatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
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
      modelName: 'AfnRemovalOrders',
      tableName: 'afn_removal_orders',
      timestamps: false,
    },
  );

  return AfnRemovalOrders;
};
