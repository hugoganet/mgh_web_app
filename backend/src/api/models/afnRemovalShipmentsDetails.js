const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing an Amazon removal shipment.
   */
  class AfnRemovalShipmentsDetails extends Model {}

  AfnRemovalShipmentsDetails.init(
    {
      afnRemovalShipmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      dataStartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dataEndTime: {
        type: DataTypes.DATE,
        allowNull: false,
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
      orderType: {
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
      modelName: 'AfnRemovalShipmentsDetails',
      tableName: 'afn_removal_shipments_details',
      timestamps: false,
    },
  );

  return AfnRemovalShipmentsDetails;
};
