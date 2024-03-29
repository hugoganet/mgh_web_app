/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asins', {
      asin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      asin: {
        type: Sequelize.STRING(10),
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
      product_category_rank_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'product_categories_ranks',
          key: 'product_category_rank_id',
        },
      },
      product_tax_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product_tax_categories',
          key: 'product_tax_category_id',
        },
      },
      asin_preparation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      url_amazon: {
        type: Sequelize.TEXT(),
        allowNull: true,
      },
      url_image: {
        type: Sequelize.TEXT(),
        allowNull: true,
      },
      asin_name: {
        type: Sequelize.TEXT(),
        allowNull: false,
      },
      asin_potential_warehouse_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      asin_number_of_active_sku: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      asin_average_unit_sold_per_day: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      is_battery_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_hazmat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_law_lang: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asins');
  },
};
