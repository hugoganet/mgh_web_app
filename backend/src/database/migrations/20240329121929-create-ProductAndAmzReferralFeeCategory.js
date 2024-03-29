/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'product_and_amz_referral_fees_categories',
      {
        productAndAmzReferralFeeCategoryId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        productCategoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'product_categories',
            key: 'product_category_id',
          },
        },
        referralFeeCategoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'amazon_referral_fees',
            key: 'referral_fee_category_id',
          },
        },
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_and_amz_referral_fees_categories');
  },
};
