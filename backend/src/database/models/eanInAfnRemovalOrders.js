const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing an EAN in Amazon removal shipments.
   */
  class EanInAfnRemovalOrder extends Model {}

  EanInAfnRemovalOrder.init(
    {
      eanInAfnRemovalOrderId: {
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
      ean: {
        type: DataTypes.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      eanShippedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eanReceivedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'EanInAfnRemovalOrder',
      tableName: 'eans_in_afn_removal_shipments_details',
      timestamps: false,
    },
  );

  return EanInAfnRemovalOrder;
};
