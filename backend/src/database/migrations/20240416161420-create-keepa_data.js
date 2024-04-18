/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('keepa_data', {
      keepa_data_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
      },
      url_image: {
        type: Sequelize.STRING(500),
      },
      product_name: {
        type: Sequelize.STRING(250),
      },
      sales_ranking_30_days_avg: {
        type: Sequelize.INTEGER,
      },
      sales_ranking_90_days_avg: {
        type: Sequelize.INTEGER,
      },
      sales_ranking_180_days_avg: {
        type: Sequelize.INTEGER,
      },
      product_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      reviews_rating: {
        type: Sequelize.DECIMAL(10, 2),
      },
      reviews_count: {
        type: Sequelize.INTEGER,
      },
      amazon_current: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon_30_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon_90_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon_180_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon_lowest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon_highest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon_90_days_oos: {
        type: Sequelize.INTEGER,
      },
      new_current: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_30_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_90_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_180_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fba_current: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fba_30_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fba_90_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fba_180_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fba_lowest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fba_pick_pack_fee: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fbm_current: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fbm_30_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fbm_90_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_third_party_fbm_180_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new_offers_current_count: {
        type: Sequelize.INTEGER,
      },
      new_offers_90_days_avg_count: {
        type: Sequelize.INTEGER,
      },
      count_retrieved_live_offers_new_fba: {
        type: Sequelize.INTEGER,
      },
      count_retrieved_live_offers_new_fbm: {
        type: Sequelize.INTEGER,
      },
      buy_box_current: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buy_box_30_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buy_box_90_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buy_box_180_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buy_box_lowest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buy_box_highest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buy_box_seller: {
        type: Sequelize.STRING(100),
      },
      buy_box_is_fba: {
        type: Sequelize.BOOLEAN,
      },
      buy_box_unqualified: {
        type: Sequelize.BOOLEAN,
      },
      url_amazon: {
        type: Sequelize.STRING(500),
      },
      url_keepa: {
        type: Sequelize.STRING(500),
      },
      categories_sub: {
        type: Sequelize.STRING(150),
      },
      asin: {
        type: Sequelize.STRING(20),
        unique: true,
      },
      ean: {
        type: Sequelize.CHAR(13),
      },
      brand: {
        type: Sequelize.STRING(100),
      },
      number_of_items: {
        type: Sequelize.INTEGER,
      },
      package_length_cm: {
        type: Sequelize.INTEGER,
      },
      package_width_cm: {
        type: Sequelize.INTEGER,
      },
      package_height_cm: {
        type: Sequelize.INTEGER,
      },
      package_weight_g: {
        type: Sequelize.INTEGER,
      },
      is_hazmat: {
        type: Sequelize.BOOLEAN,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('keepa_data');
  },
};
