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
        // this creates a column called product_name in the table
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      brandId: {
        // this create a column called brand_id in the table
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'brands', // so here I should specify the table's name in my db, so brands_table ?
          key: 'brand_id', // this should be brand_id in the table, right ?
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
