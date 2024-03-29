const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing shipments in the Amazon fulfillment network.
   */
  class AfnShipments extends Model {}

  AfnShipments.init(
    {
      afnShipmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses', // Ensure this matches your actual Warehouse model name
          key: 'warehouse_id',
        },
      },
      shipTo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amazonId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amazonReferenceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      numberOfSku: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skuQuantityExpected: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skuQuantityLocated: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fbaManualProcessingCostExc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      amazonPartneredCarrierCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      prepAndLabelingCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AfnShipments',
      tableName: 'afn_shipments',
      timestamps: false,
    },
  );

  return AfnShipments;
};
