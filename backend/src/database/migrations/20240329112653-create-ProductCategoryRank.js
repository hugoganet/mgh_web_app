/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_categories_ranks', {
      productCategoryRankId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'countryCode',
        },
      },
      productCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product_categories',
          key: 'productCategoryId',
        },
      },
      rankingThreshold: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rankingThresholdPercentage: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_categories_ranks');
  },
};
