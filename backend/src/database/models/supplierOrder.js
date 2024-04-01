const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class SupplierOrder
   * @extends Model
   * @classdesc Represents an order made to a supplier, including financial details and delivery information.
   */
  class SupplierOrder extends Model {}

  SupplierOrder.init(
    {
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
    },
    {
      sequelize,
      modelName: 'SupplierOrder',
      tableName: 'supplier_orders',
      timestamps: false,
    },
  );

  return SupplierOrder;
};
