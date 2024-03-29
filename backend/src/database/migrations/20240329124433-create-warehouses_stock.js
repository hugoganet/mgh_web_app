/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warehouses_stock', {
      warehouse_stock_id: {
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
      ean_in_supplier_order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'eans_in_suppliers_orders',
          key: 'ean_in_supplier_order_id',
        },
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      warehouse_total_received_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      warehouse_total_shipped_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      warehouse_in_stock_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('warehouses_stock');
  },
};
