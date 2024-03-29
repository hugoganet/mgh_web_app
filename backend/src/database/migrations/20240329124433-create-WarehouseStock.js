/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warehouses_stock', {
      warehouseStockId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      eanSupplierOrderId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'eans_in_suppliers_orders',
          key: 'ean_in_supplier_order_id',
        },
      },
      ean: {
        type: DataTypes.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      warehouseTotalReceivedQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      warehouseTotalShippedQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      warehouseInStockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('warehouses_stock');
  },
};
