/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('amazon_referral_fees', {
      referralFeeCategoryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      countryCode: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      referralFeeCategoryNameEn: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      referralFeePercentage: {
        type: Sequelize.DECIMAL(7, 5),
        allowNull: false,
      },
      reducedReferralFeePercentage: {
        type: Sequelize.DECIMAL(7, 5),
      },
      reducedReferralFeeLimit: {
        type: Sequelize.DECIMAL(10, 2),
      },
      reducedReferralFeeThreshold: {
        type: Sequelize.DECIMAL(10, 2),
      },
      perItemMinimumReferralFee: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      closingFee: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      currencyCode: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('amazon_referral_fees');
  },
};
