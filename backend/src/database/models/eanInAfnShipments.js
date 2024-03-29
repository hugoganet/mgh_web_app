const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing the association of EANs within Amazon fulfillment network shipments.
   */
  class EanInAfnShipments extends Model {}

  EanInAfnShipments.init(
    {
      eanInAfnShipmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      afnShipmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'afn_shipments',
          key: 'afn_shipment_id',
        },
      },
      ean: {
        type: DataTypes.CHAR(13),
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
    },
    {
      sequelize,
      modelName: 'EanInAfnShipments',
      tableName: 'eans_in_afn_shipments',
      timestamps: false,
    },
  );

  return EanInAfnShipments;
};
