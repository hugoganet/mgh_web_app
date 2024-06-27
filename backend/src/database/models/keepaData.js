const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing detailed Keepa data for products including pricing, sales rankings, reviews, and more.
   */
  class KeepaData extends Model {}

  KeepaData.init(
    {
      keepaDataId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      countryCode: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
      asin: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      urlImage: {
        type: DataTypes.TEXT,
      },
      ean: {
        type: DataTypes.CHAR(13),
      },
      brand: {
        type: DataTypes.STRING,
      },
      productName: {
        type: DataTypes.STRING,
      },
      productCategoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'product_category',
          key: 'productCategoryId',
        },
      },
      salesRanking30DaysAvg: {
        type: DataTypes.INTEGER,
        field: 'sales_ranking_30_days_avg',
      },
      salesRanking90DaysAvg: {
        type: DataTypes.INTEGER,
        field: 'sales_ranking_90_days_avg',
      },
      salesRanking180DaysAvg: {
        type: DataTypes.INTEGER,
        field: 'sales_ranking_180_days_avg',
      },
      reviewsRating: {
        type: DataTypes.DECIMAL(10, 2),
      },
      reviewsCount: {
        type: DataTypes.INTEGER,
      },
      amazonCurrent: {
        type: DataTypes.DECIMAL(10, 2),
      },
      amazon30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'amazon_30_days_avg',
      },
      amazon90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'amazon_90_days_avg',
      },
      amazon180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'amazon_180_days_avg',
      },
      amazonLowest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      amazonHighest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      amazon90DaysOOS: {
        type: DataTypes.DECIMAL(6, 5),
        field: 'amazon_90_days_oos',
      },
      newCurrent: {
        type: DataTypes.DECIMAL(10, 2),
      },
      new30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_30_days_avg',
      },
      new90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_90_days_avg',
      },
      new180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_180_days_avg',
      },
      newThirdPartyFBACurrent: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fba_current',
      },
      newThirdPartyFBA30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fba_30_days_avg',
      },
      newThirdPartyFBA90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fba_90_days_avg',
      },
      newThirdPartyFBA180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fba_180_days_avg',
      },
      newThirdPartyFBALowest: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fba_lowest',
      },
      fbaPickPackFee: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBMCurrent: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fbm_current',
      },
      newThirdPartyFBM30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fbm_30_days_avg',
      },
      newThirdPartyFBM90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fbm_90_days_avg',
      },
      newThirdPartyFBM180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'new_third_party_fbm_180_days_avg',
      },
      newOffersCurrentCount: {
        type: DataTypes.INTEGER,
      },
      newOffers90DaysAvgCount: {
        type: DataTypes.INTEGER,
        field: 'new_offers_90_days_avg_count',
      },
      countRetrievedLiveOffersNewFBA: {
        type: DataTypes.INTEGER,
        field: 'count_retrieved_live_offers_new_fba',
      },
      countRetrievedLiveOffersNewFBM: {
        type: DataTypes.INTEGER,
        field: 'count_retrieved_live_offers_new_fbm',
      },
      buyBoxCurrent: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBox30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'buy_box_30_days_avg',
      },
      buyBox90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'buy_box_90_days_avg',
      },
      buyBox180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'buy_box_180_days_avg',
      },
      buyBoxLowest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBoxHighest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBoxSeller: {
        type: DataTypes.STRING,
      },
      buyBoxIsFBA: {
        type: DataTypes.BOOLEAN,
        field: 'buy_box_is_fba',
      },
      buyBoxUnqualified: {
        type: DataTypes.BOOLEAN,
      },
      urlAmazon: {
        type: DataTypes.STRING,
      },
      urlKeepa: {
        type: DataTypes.STRING,
      },
      categoriesSub: {
        type: DataTypes.STRING,
      },
      numberOfItems: {
        type: DataTypes.INTEGER,
      },
      packageLengthCm: {
        type: DataTypes.INTEGER,
      },
      packageWidthCm: {
        type: DataTypes.INTEGER,
      },
      packageHeightCm: {
        type: DataTypes.INTEGER,
      },
      packageWeightG: {
        type: DataTypes.INTEGER,
      },
      isHazmat: {
        type: DataTypes.BOOLEAN,
      },
      salesRankingCurrent: {
        type: DataTypes.INTEGER,
        field: 'sales_ranking_current',
      },
      reviewsCount30DaysAvg: {
        type: DataTypes.INTEGER,
        field: 'reviews_count_30_days_avg',
      },
      reviewsCount90DaysAvg: {
        type: DataTypes.INTEGER,
        field: 'reviews_count_90_days_avg',
      },
      reviewsCount180DaysAvg: {
        type: DataTypes.INTEGER,
        field: 'reviews_count_180_days_avg',
      },
      mapRestriction: {
        type: DataTypes.STRING,
        field: 'map_restriction',
      },
      lowestFBASeller: {
        type: DataTypes.STRING,
        field: 'lowest_fba_seller',
      },
      listPriceCurrent: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'list_price_current',
      },
      listPrice30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'list_price_30_days_avg',
      },
      listPrice90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'list_price_90_days_avg',
      },
      listPrice180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'list_price_180_days_avg',
      },
      listPrice30DaysDropPercent: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'list_price_30_days_drop_percent',
      },
      listPrice90DaysDropPercent: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'list_price_90_days_drop_percent',
      },
      listPriceLowest: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'list_price_lowest',
      },
      listPriceHighest: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'list_price_highest',
      },
      trackingSince: {
        type: DataTypes.DATE,
        field: 'tracking_since',
      },
      listedSince: {
        type: DataTypes.DATE,
        field: 'listed_since',
      },
      categoriesRoot: {
        type: DataTypes.STRING,
        field: 'categories_root',
      },
      upc: {
        type: DataTypes.CHAR(12),
      },
      partNumber: {
        type: DataTypes.STRING,
        field: 'part_number',
      },
      variationASINs: {
        type: DataTypes.STRING,
        field: 'variation_asins',
      },
      freqBoughtTogether: {
        type: DataTypes.STRING,
        field: 'freq_bought_together',
      },
      manufacturer: {
        type: DataTypes.STRING,
      },
      variationAttributes: {
        type: DataTypes.STRING,
        field: 'variation_attributes',
      },
      itemDimensionCm3: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'item_dimension_cm3',
      },
      itemLengthCm: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'item_length_cm',
      },
      itemWidthCm: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'item_width_cm',
      },
      itemHeightCm: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'item_height_cm',
      },
      description: {
        type: DataTypes.TEXT,
      },
      feature1: {
        type: DataTypes.STRING,
        field: 'feature_1',
      },
      feature2: {
        type: DataTypes.STRING,
        field: 'feature_2',
      },
      feature3: {
        type: DataTypes.STRING,
        field: 'feature_3',
      },
      feature4: {
        type: DataTypes.STRING,
        field: 'feature_4',
      },
      feature5: {
        type: DataTypes.STRING,
        field: 'feature_5',
      },
      newOfferCount30DaysAvg: {
        type: DataTypes.INTEGER,
        field: 'new_offer_count_30_days_avg',
      },
      newOfferCount180DaysAvg: {
        type: DataTypes.INTEGER,
        field: 'new_offer_count_180_days_avg',
      },
      contributors: {
        type: DataTypes.STRING,
      },
      packageQuantity: {
        type: DataTypes.INTEGER,
        field: 'package_quantity',
      },
      feature6: {
        type: DataTypes.STRING,
        field: 'feature_6',
      },
      feature7: {
        type: DataTypes.STRING,
        field: 'feature_7',
      },
      feature8: {
        type: DataTypes.STRING,
        field: 'feature_8',
      },
      feature9: {
        type: DataTypes.STRING,
        field: 'feature_9',
      },
      feature10: {
        type: DataTypes.STRING,
        field: 'feature_10',
      },
      referralFeeBuyBoxPrice: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'referral_fee_buy_box_price',
      },
      imageCount: {
        type: DataTypes.INTEGER,
        field: 'image_count',
      },
      buyBoxPercentAmazon30Days: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'buy_box_percent_amazon_30_days',
      },
      buyBoxPercentAmazon90Days: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'buy_box_percent_amazon_90_days',
      },
      buyBoxPercentAmazon180Days: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'buy_box_percent_amazon_180_days',
      },
      buyBoxPercentAmazon365Days: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'buy_box_percent_amazon_365_days',
      },
      buyBoxPercentTopSeller30Days: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'buy_box_percent_top_seller_30_days',
      },
      buyBoxPercentTopSeller90Days: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'buy_box_percent_top_seller_90_days',
      },
      buyBoxPercentTopSeller180Days: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'buy_box_percent_top_seller_180_days',
      },
      buyBoxPercentTopSeller365Days: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'buy_box_percent_top_seller_365_days',
      },
      buyBoxWinnerCount30Days: {
        type: DataTypes.INTEGER,
        field: 'buy_box_winner_count_30_days',
      },
      buyBoxWinnerCount90Days: {
        type: DataTypes.INTEGER,
        field: 'buy_box_winner_count_90_days',
      },
      buyBoxWinnerCount180Days: {
        type: DataTypes.INTEGER,
        field: 'buy_box_winner_count_180_days',
      },
      buyBoxWinnerCount365Days: {
        type: DataTypes.INTEGER,
        field: 'buy_box_winner_count_365_days',
      },
      competitivePriceThreshold: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'competitive_price_threshold',
      },
      suggestedLowerPrice: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'suggested_lower_price',
      },
      buyBoxEligibleOfferCountsNewFBA: {
        type: DataTypes.INTEGER,
        field: 'buy_box_eligible_offer_counts_new_fba',
      },
      buyBoxEligibleOfferCountsNewFBM: {
        type: DataTypes.INTEGER,
        field: 'buy_box_eligible_offer_counts_new_fbm',
      },
      buyBoxEligibleOfferCountsUsedFBA: {
        type: DataTypes.INTEGER,
        field: 'buy_box_eligible_offer_counts_used_fba',
      },
      buyBoxEligibleOfferCountsUsedFBM: {
        type: DataTypes.INTEGER,
        field: 'buy_box_eligible_offer_counts_used_fbm',
      },
      buyBoxEligibleOfferCountsCollectibleFBA: {
        type: DataTypes.INTEGER,
        field: 'buy_box_eligible_offer_counts_collectible_fba',
      },
      buyBoxEligibleOfferCountsCollectibleFBM: {
        type: DataTypes.INTEGER,
        field: 'buy_box_eligible_offer_counts_collectible_fbm',
      },
      buyBoxEligibleOfferCountsRefurbishedFBA: {
        type: DataTypes.INTEGER,
        field: 'buy_box_eligible_offer_counts_refurbished_fba',
      },
      buyBoxEligibleOfferCountsRefurbishedFBM: {
        type: DataTypes.INTEGER,
        field: 'buy_box_eligible_offer_counts_refurbished_fbm',
      },
      listPrice1DayDropPercent: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'list_price_1_day_drop_percent',
      },
      listPrice7DaysDropPercent: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'list_price_7_days_drop_percent',
      },
      importedByCode: {
        type: DataTypes.STRING,
        field: 'imported_by_code',
      },
      variationCount: {
        type: DataTypes.INTEGER,
        field: 'variation_count',
      },
      type: {
        type: DataTypes.STRING,
      },
      hazardousMaterials: {
        type: DataTypes.STRING,
        field: 'hazardous_materials',
      },
    },
    {
      sequelize,
      modelName: 'KeepaData',
      tableName: 'keepa_data',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['asin', 'country_code'],
        },
      ],
    },
  );

  return KeepaData;
};
