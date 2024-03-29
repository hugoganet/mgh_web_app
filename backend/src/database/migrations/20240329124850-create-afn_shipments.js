/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_shipments', {
      afn_shipment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      ship_to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amazon_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amazon_reference_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creation_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      last_update: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      number_of_sku: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sku_quantity_expected: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sku_quantity_located: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fba_manual_processing_cost_exc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      amazon_partnered_carrier_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      prep_and_labeling_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_shipments');
  },
};
