/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warehouses_stock', {
      warehouseStockId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      eanSupplierOrderId: {
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
      warehouseTotalReceivedQuantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      warehouseTotalShippedQuantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      warehouseInStockQuantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('warehouses_stock');
  },
};
