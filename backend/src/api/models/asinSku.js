const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class AsinSku
   * @extends Model
   * @classdesc Create a AsinSku class
   */
  class AsinSku extends Model {}

  AsinSku.init(
    {
      asinSkuId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      asinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'asins',
          key: 'asin_id',
        },
      },
      skuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'AsinSku',
      tableName: 'asins_skus',
    },
  );

  return AsinSku;
};
