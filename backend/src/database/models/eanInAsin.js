const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class EanInAsin
   * @extends Model
   * @classdesc Create a EanInAsin class
   */
  class EanInAsin extends Model {}

  EanInAsin.init(
    {
      eanInAsinId: {
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
      ean: {
        type: DataTypes.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      eanInAsinQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'EanInAsin',
      tableName: 'eans_in_asins',
      timestamps: false,
    },
  );

  return EanInAsin;
};
