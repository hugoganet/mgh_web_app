/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_removal_orders', {
      afn_removal_order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      amazon_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      request_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastUpdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      order_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      orderStatus: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      total_removal_fee: {
        type: Sequelize.DECIMAL(10, 2),
      },
      removal_fee_currency: {
        type: Sequelize.CHAR(3),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_removal_orders');
  },
};
