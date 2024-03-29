/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_removal_shipments_details', {
      afn_removal_shipment_detail_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      afn_removal_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'afn_removal_orders',
          key: 'afn_removal_order_id',
        },
      },
      data_start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      request_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      shipment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sku_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      fnsku: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      disposition: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      shipped_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      carrier: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      tracking_number: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_removal_shipments_details');
  },
};
