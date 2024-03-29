/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_categories_ranks', {
      product_category_rank_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      product_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      ranking_threshold: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ranking_threshold_percentage: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_categories_ranks');
  },
};
