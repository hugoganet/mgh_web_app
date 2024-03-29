/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_shipments', {
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_shipments');
  },
};
