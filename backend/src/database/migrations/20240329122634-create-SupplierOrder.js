/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supplier_orders', {
      supplierOrderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      supplierId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'supplier_id',
        },
      },
      supplierOrderMadeDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      supplierOrderDeliveryDate: {
        type: Sequelize.DATEONLY,
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      supplierOrderNumberOfUnit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      supplierOrderTotalPaidExc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      supplierOrderDeliveryCostExc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      supplierOrderDeliveryCostVatRate: {
        type: Sequelize.DECIMAL(6, 5),
        allowNull: false,
      },
      supplierOrderVatPaid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      supplierOrderInvoiceFileLink: {
        type: Sequelize.STRING(255),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('supplier_orders');
  },
};
