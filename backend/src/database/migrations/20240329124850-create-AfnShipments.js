/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_shipments', {
      afnShipmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses', // Ensure this matches your actual Warehouse model name
          key: 'warehouse_id',
        },
      },
      shipTo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amazonId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amazonReferenceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastUpdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      numberOfSku: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      skuQuantityExpected: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      skuQuantityLocated: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fbaManualProcessingCostExc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      amazonPartneredCarrierCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      prepAndLabelingCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_shipments');
  },
};
