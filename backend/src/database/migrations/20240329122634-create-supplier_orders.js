/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supplier_orders', {
      supplier_order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'supplier_id',
        },
      },
      supplier_order_made_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      supplier_order_delivery_date: {
        type: Sequelize.DATEONLY,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      supplier_order_number_of_unit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      supplier_order_total_paid_exc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      supplier_order_delivery_cost_exc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      supplier_order_delivery_cost_vat_rate: {
        type: Sequelize.DECIMAL(6, 5),
        allowNull: false,
      },
      supplier_order_vat_paid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      supplier_order_invoice_file_link: {
        type: Sequelize.STRING(255),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('supplier_orders');
  },
};
