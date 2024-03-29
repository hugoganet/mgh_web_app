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
      amazonId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      orderType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      orderStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      totalRemovalFee: {
        type: DataTypes.DECIMAL(10, 2),
      },
      removalFeeCurrency: {
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
