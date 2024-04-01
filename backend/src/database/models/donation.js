const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class Donation
   * @extends Model
   * @classdesc Represents a donation made by the company, including details like the recipient and date.
   */
  class Donation extends Model {}

  Donation.init(
    {
      donationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      donationTo: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      donationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      donationNote: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Donation',
      tableName: 'donations',
      timestamps: false,
    },
  );

  return Donation;
};
