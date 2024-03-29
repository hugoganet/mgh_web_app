/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_suppliers_orders', {
      eanInSupplierOrderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      ean: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      supplierOrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'supplier_orders',
          key: 'supplier_order_id',
        },
      },
      eanOrderedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eanReceivedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      productPurchaseCostExc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      productVatRate: {
        type: DataTypes.DECIMAL(7, 5),
        allowNull: false,
      },
      bestBeforeDate: {
        type: DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_suppliers_orders');
  },
};
