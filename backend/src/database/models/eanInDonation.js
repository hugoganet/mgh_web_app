const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class EanInDonation
   * @extends Model
   * @classdesc Creates a bridge between Ean and Donation models
   */
  class EanInDonation extends Model {}

  EanInDonation.init(
    {
      eanInDonationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ean: {
        type: DataTypes.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      donationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'donations',
          key: 'donation_id',
        },
      },
      eanDonationQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'EanInDonation',
      tableName: 'eans_in_donations',
      timestamps: false,
    },
  );

  return EanInDonation;
};
