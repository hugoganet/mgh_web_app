/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_suppliers_orders', {
      eanInSupplierOrderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      ean: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      supplierOrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'supplier_orders',
          key: 'supplier_order_id',
        },
      },
      eanOrderedQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      eanReceivedQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      productPurchaseCostExc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      productVatRate: {
        type: Sequelize.DECIMAL(7, 5),
        allowNull: false,
      },
      bestBeforeDate: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_suppliers_orders');
  },
};
