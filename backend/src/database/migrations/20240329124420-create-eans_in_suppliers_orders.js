/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_suppliers_orders', {
      ean_in_supplier_order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      supplier_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'supplier_orders',
          key: 'supplier_order_id',
        },
      },
      ean_ordered_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ean_received_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      product_purchase_cost_exc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      product_vat_rate: {
        type: Sequelize.DECIMAL(7, 5),
        allowNull: false,
      },
      best_before_date: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_suppliers_orders');
  },
};
