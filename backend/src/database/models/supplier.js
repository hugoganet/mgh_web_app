const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class Supplier
   * @extends Model
   * @classdesc Represents suppliers with various contact and category details.
   */
  class Supplier extends Model {}

  Supplier.init(
    {
      supplierId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      productCategoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      supplierName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      supplierWebsite: {
        type: DataTypes.STRING(250),
        unique: true,
      },
      supplierNumber: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      supplierEmail: {
        type: DataTypes.STRING(250),
        unique: true,
      },
      supplierAddress: {
        type: DataTypes.STRING(255),
      },
      supplierPostcode: {
        type: DataTypes.STRING(20),
      },
      countryCode: {
        type: DataTypes.STRING(50),
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      supplierNote: {
        type: DataTypes.TEXT,
      },
      contactName: {
        type: DataTypes.STRING(50),
      },
      contactPosition: {
        type: DataTypes.STRING(50),
      },
      contactNumber: {
        type: DataTypes.STRING(20),
      },
      contactEmail: {
        type: DataTypes.STRING(250),
      },
      accountOpen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      accountRefused: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      accountRefusedDate: {
        type: DataTypes.DATE,
      },
      accountRefusedReason: {
        type: DataTypes.TEXT,
      },
      isInteresting: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isBrand: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'suppliers',
      timestamps: false,
    },
  );

  return Supplier;
};
