const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class WarehouseStock
   * @extends Model
   * @classdesc Create a WarehouseStock class
   */
  class WarehouseStock extends Model {}

  WarehouseStock.init(
    {
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
    },
    {
      sequelize,
      modelName: 'WarehouseStock',
      tableName: 'warehouses_stock',
      timestamps: false,
    },
  );

  return WarehouseStock;
};
