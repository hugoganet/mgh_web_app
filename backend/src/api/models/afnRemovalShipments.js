const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing an Amazon removal shipment.
   */
  class AfnRemovalShipments extends Model {}

  AfnRemovalShipments.init(
    {
      afnRemovalShipmentId: {
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
      shipmentDate: {
        type: DataTypes.DATE,
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
      fnsku: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      disposition: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      shippedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carrier: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      trackingNumber: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      removalOrderType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'AfnRemovalShipments',
      tableName: 'afn_removal_shipments',
      timestamps: false,
    },
  );

  return AfnRemovalShipments;
};
