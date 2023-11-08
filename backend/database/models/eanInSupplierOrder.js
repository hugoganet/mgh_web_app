const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class EanInSupplierOrder
   * @extends Model
   * @classdesc Creates a bridge between Ean and SupplierOrder models
   */
  class EanInSupplierOrder extends Model {}

  EanInSupplierOrder.init(
    {
      eanInSupplierOrderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      catalogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'catalog',
          key: 'catalog_id',
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
    },
    {
      sequelize,
      modelName: 'EanInSupplierOrder',
      tableName: 'eans_in_suppliers_orders',
    },
  );

  return EanInSupplierOrder;
};
