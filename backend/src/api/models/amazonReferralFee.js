const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing the Amazon referral fee for a product category in a country.
   */
  class AmazonReferralFee extends Model {}

  AmazonReferralFee.init(
    {
      referralFeeCategoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      countryCode: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      referralFeeCategoryNameEn: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      referralFeePercentage: {
        type: DataTypes.DECIMAL(6, 5),
        allowNull: false,
      },
      reducedReferralFeePercentage: {
        type: DataTypes.DECIMAL(6, 5),
      },
      reducedReferralFeeLimit: {
        type: DataTypes.DECIMAL(10, 2),
      },
      reducedReferralFeeThreshold: {
        type: DataTypes.DECIMAL(10, 2),
      },
      perItemMinimumReferralFee: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      closingFee: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      currencyCode: {
        type: DataTypes.CHAR(3),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AmazonReferralFee',
      tableName: 'amazon_referral_fees',
      timestamps: false,
    },
  );

  return AmazonReferralFee;
};
