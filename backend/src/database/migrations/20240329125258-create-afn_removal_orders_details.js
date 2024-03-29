/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_removal_orders_details', {
      afn_removal_order_detail_id: {
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
      requested_quantity: {
        type: Sequelize.INTEGER,
      },
      cancelled_quantity: {
        type: Sequelize.INTEGER,
      },
      disposed_quantity: {
        type: Sequelize.INTEGER,
      },
      shipped_quantity: {
        type: Sequelize.INTEGER,
      },
      in_process_quantity: {
        type: Sequelize.INTEGER,
      },
      removal_fee: {
        type: Sequelize.DECIMAL(10, 2),
      },
      currency_code: {
        type: Sequelize.CHAR(3),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_removal_orders_details');
  },
};
