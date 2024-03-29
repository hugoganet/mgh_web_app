/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supplier_orders', {
      supplierOrderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'supplier_id',
        },
      },
      supplierOrderMadeDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      supplierOrderDeliveryDate: {
        type: DataTypes.DATEONLY,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      supplierOrderNumberOfUnit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      supplierOrderTotalPaidExc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      supplierOrderDeliveryCostExc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      supplierOrderDeliveryCostVatRate: {
        type: DataTypes.DECIMAL(6, 5),
        allowNull: false,
      },
      supplierOrderVatPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      supplierOrderInvoiceFileLink: {
        type: DataTypes.STRING(255),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('supplier_orders');
  },
};
