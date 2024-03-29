/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('amazon_referral_fees', {
      referral_fee_category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      referral_fee_category_name_en: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      referral_fee_percentage: {
        type: Sequelize.DECIMAL(7, 5),
        allowNull: false,
      },
      reduced_referral_fee_percentage: {
        type: Sequelize.DECIMAL(7, 5),
      },
      reduced_referral_fee_limit: {
        type: Sequelize.DECIMAL(10, 2),
      },
      reduced_referral_fee_threshold: {
        type: Sequelize.DECIMAL(10, 2),
      },
      per_item_minimum_referral_fee: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      closing_fee: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      currency_code: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('amazon_referral_fees');
  },
};
