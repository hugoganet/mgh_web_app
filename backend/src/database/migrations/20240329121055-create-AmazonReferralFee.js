/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('amazon_referral_fees', {
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
        type: DataTypes.DECIMAL(7, 5),
        allowNull: false,
      },
      reducedReferralFeePercentage: {
        type: DataTypes.DECIMAL(7, 5),
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('amazon_referral_fees');
  },
};
