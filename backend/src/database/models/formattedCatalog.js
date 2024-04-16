const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing a formatted catalog entry, including product details such as name, price, VAT rate, and currency.
   */
  class FormattedCatalog extends Model {}

  FormattedCatalog.init(
    {
      formattedCatalogId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      ean: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: /^[0-9]{13}$/,
            msg: 'EAN must be 13 digits long.',
          },
        },
      },
      supplierPartNumber: {
        type: DataTypes.STRING(50),
        unique: true,
      },
      productName: {
        type: DataTypes.STRING(250),
      },
      productPriceExc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      productVatRate: {
        type: DataTypes.DECIMAL(6, 5),
      },
      currencyCode: {
        type: DataTypes.CHAR(3),
      },
    },
    {
      sequelize,
      modelName: 'FormattedCatalog',
      tableName: 'formatted_catalog',
      timestamps: false,
    },
  );

  return FormattedCatalog;
};
