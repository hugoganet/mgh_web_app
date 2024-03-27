const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing an EAN in Amazon removal shipments.
   */
  class EanInAfnRemovalShipment extends Model {}

  EanInAfnRemovalShipment.init(
    {
      eanInAfnRemovalShipmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'afn_removal_shipments',
          key: 'order_id',
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
      eanRemovalShipmentQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'EanInAfnRemovalShipment',
      tableName: 'eans_in_afn_removal_shipments',
      timestamps: false,
    },
  );

  return EanInAfnRemovalShipment;
};
