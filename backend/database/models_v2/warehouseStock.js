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
      // eanInSupplierOrder: {
      //     type: DataTypes.STRING(13),
      //     primaryKey: true,
      //     allowNull: false,
      //     references: {
      //         model: 'eanInSupplierOrder', // Ensure this is the correct table name
      //         key: 'id'
      //     }
      // },
      ean: {
        type: DataTypes.STRING(13),
        allowNull: false,
        references: {
          model: 'Ean',
          key: 'ean',
        },
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Warehouse',
          key: 'warehouseId',
        },
      },
      warehouseTotalReceivedQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        // No need for allowNull because it's a calculated field
      },
      // warehouse_total_shipped_quantity - INT, calculated field
      warehouseTotalShippedQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        // No need for allowNull because it's a calculated field
      },
      warehouseInStockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        // No need for allowNull because it's a calculated field
      },
    },
    {
      sequelize,
      modelName: 'WarehouseStock',
      tableName: 'warehouses_stock',
    },
  );

  return WarehouseStock;
};
