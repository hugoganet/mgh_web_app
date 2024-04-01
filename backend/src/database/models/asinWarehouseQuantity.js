const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class AsinWarehouseQuantity
   * @extends Model
   * @classdesc Create a AsinWarehouseQuantity class
   */
  class AsinWarehouseQuantity extends Model {}

  AsinWarehouseQuantity.init(
    {
      asinId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      totalWarehouseQuantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'AsinWarehouseQuantity',
      tableName: 'asin_warehouse_quantities',
      timestamps: true,
      freezeTableName: true,
    },
  );

  return AsinWarehouseQuantity;
};
