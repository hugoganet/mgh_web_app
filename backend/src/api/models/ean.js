const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class Ean
   * @extends Model
   * @classdesc Create a Ean class
   */
  class Ean extends Model {}

  Ean.init(
    {
      ean: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true,
        validate: {
          is: {
            args: /^[0-9]{13}$/,
            msg: 'EAN must be 13 digits long.',
          },
        },
      },
      productName: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'brands',
          key: 'brand_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Ean',
      tableName: 'eans',
    },
  );

  return Ean;
};
