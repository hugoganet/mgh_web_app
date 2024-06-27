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
      asin: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      url_image: {
        type: Sequelize.TEXT,
      },
      ean: {
        type: Sequelize.CHAR(13),
      },
      brand: {
        type: Sequelize.STRING,
      },
      product_name: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
      },
      buy_box_is_fba: {
        type: Sequelize.BOOLEAN,
      },
      buy_box_unqualified: {
        type: Sequelize.BOOLEAN,
      },
      url_amazon: {
        type: Sequelize.STRING,
      },
      url_keepa: {
        type: Sequelize.STRING,
      },
      categories_sub: {
        type: Sequelize.STRING,
      },
      number_of_items: {
        type: Sequelize.INTEGER,
      },
      package_length_cm: {
        type: Sequelize.DECIMAL(10, 2),
      },
      package_width_cm: {
        type: Sequelize.DECIMAL(10, 2),
      },
      package_height_cm: {
        type: Sequelize.DECIMAL(10, 2),
      },
      package_weight_g: {
        type: Sequelize.DECIMAL(10, 2),
      },
      is_hazmat: {
        type: Sequelize.BOOLEAN,
      },
      sales_ranking_current: {
        type: Sequelize.INTEGER,
      },
      reviews_count_30_days_avg: {
        type: Sequelize.INTEGER,
      },
      reviews_count_90_days_avg: {
        type: Sequelize.INTEGER,
      },
      reviews_count_180_days_avg: {
        type: Sequelize.INTEGER,
      },
      map_restriction: {
        type: Sequelize.STRING,
      },
      lowest_fba_seller: {
        type: Sequelize.STRING,
      },
      list_price_current: {
        type: Sequelize.DECIMAL(10, 2),
      },
      list_price_30_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      list_price_90_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      list_price_180_days_avg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      list_price_30_days_drop_percent: {
        type: Sequelize.DECIMAL(5, 2),
      },
      list_price_90_days_drop_percent: {
        type: Sequelize.DECIMAL(5, 2),
      },
      list_price_lowest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      list_price_highest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      tracking_since: {
        type: Sequelize.DATE,
      },
      listed_since: {
        type: Sequelize.DATE,
      },
      categories_root: {
        type: Sequelize.STRING,
      },
      upc: {
        type: Sequelize.CHAR(12),
      },
      part_number: {
        type: Sequelize.STRING,
      },
      variation_asins: {
        type: Sequelize.STRING,
      },
      freq_bought_together: {
        type: Sequelize.STRING,
      },
      manufacturer: {
        type: Sequelize.STRING,
      },
      variation_attributes: {
        type: Sequelize.STRING,
      },
      item_dimension_cm3: {
        type: Sequelize.DECIMAL(10, 2),
      },
      item_length_cm: {
        type: Sequelize.DECIMAL(10, 2),
      },
      item_width_cm: {
        type: Sequelize.DECIMAL(10, 2),
      },
      item_height_cm: {
        type: Sequelize.DECIMAL(10, 2),
      },
      item_weight_g: {
        type: Sequelize.DECIMAL(10, 2),
      },
      description: {
        type: Sequelize.TEXT,
      },
      feature_1: {
        type: Sequelize.STRING,
      },
      feature_2: {
        type: Sequelize.STRING,
      },
      feature_3: {
        type: Sequelize.STRING,
      },
      feature_4: {
        type: Sequelize.STRING,
      },
      feature_5: {
        type: Sequelize.STRING,
      },
      new_offer_count_30_days_avg: {
        type: Sequelize.INTEGER,
      },
      new_offer_count_180_days_avg: {
        type: Sequelize.INTEGER,
      },
      contributors: {
        type: Sequelize.STRING,
      },
      package_quantity: {
        type: Sequelize.INTEGER,
      },
      feature_6: {
        type: Sequelize.STRING,
      },
      feature_7: {
        type: Sequelize.STRING,
      },
      feature_8: {
        type: Sequelize.STRING,
      },
      feature_9: {
        type: Sequelize.STRING,
      },
      feature_10: {
        type: Sequelize.STRING,
      },
      referral_fee_buy_box_price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      image_count: {
        type: Sequelize.INTEGER,
      },
      buy_box_percent_amazon_30_days: {
        type: Sequelize.DECIMAL(5, 2),
      },
      buy_box_percent_amazon_90_days: {
        type: Sequelize.DECIMAL(5, 2),
      },
      buy_box_percent_amazon_180_days: {
        type: Sequelize.DECIMAL(5, 2),
      },
      buy_box_percent_amazon_365_days: {
        type: Sequelize.DECIMAL(5, 2),
      },
      buy_box_percent_top_seller_30_days: {
        type: Sequelize.DECIMAL(5, 2),
      },
      buy_box_percent_top_seller_90_days: {
        type: Sequelize.DECIMAL(5, 2),
      },
      buy_box_percent_top_seller_180_days: {
        type: Sequelize.DECIMAL(5, 2),
      },
      buy_box_percent_top_seller_365_days: {
        type: Sequelize.DECIMAL(5, 2),
      },
      buy_box_winner_count_30_days: {
        type: Sequelize.INTEGER,
      },
      buy_box_winner_count_90_days: {
        type: Sequelize.INTEGER,
      },
      buy_box_winner_count_180_days: {
        type: Sequelize.INTEGER,
      },
      buy_box_winner_count_365_days: {
        type: Sequelize.INTEGER,
      },
      competitive_price_threshold: {
        type: Sequelize.DECIMAL(10, 2),
      },
      suggested_lower_price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buy_box_eligible_offer_counts_new_fba: {
        type: Sequelize.INTEGER,
      },
      buy_box_eligible_offer_counts_new_fbm: {
        type: Sequelize.INTEGER,
      },
      buy_box_eligible_offer_counts_used_fba: {
        type: Sequelize.INTEGER,
      },
      buy_box_eligible_offer_counts_used_fbm: {
        type: Sequelize.INTEGER,
      },
      buy_box_eligible_offer_counts_collectible_fba: {
        type: Sequelize.INTEGER,
      },
      buy_box_eligible_offer_counts_collectible_fbm: {
        type: Sequelize.INTEGER,
      },
      buy_box_eligible_offer_counts_refurbished_fba: {
        type: Sequelize.INTEGER,
      },
      buy_box_eligible_offer_counts_refurbished_fbm: {
        type: Sequelize.INTEGER,
      },
      list_price_1_day_drop_percent: {
        type: Sequelize.DECIMAL(5, 2),
      },
      list_price_7_days_drop_percent: {
        type: Sequelize.DECIMAL(5, 2),
      },
      imported_by_code: {
        type: Sequelize.STRING,
      },
      variation_count: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      hazardous_materials: {
        type: Sequelize.STRING,
      },
    });

    // Create a unique index on asin and country_code after the table creation
    await queryInterface.addIndex('keepa_data', ['asin', 'country_code'], {
      unique: true,
      name: 'keepa_data_asin_country_code_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('keepa_data');
  },
};
