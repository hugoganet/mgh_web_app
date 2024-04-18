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
        type: DataTypes.STRING(500),
      },
      ean: {
        type: DataTypes.CHAR(13),
      },
      brand: {
        type: DataTypes.STRING(500),
      },
      productName: {
        type: DataTypes.STRING(500),
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
        type: DataTypes.STRING(500),
      },
      buyBoxIsFBA: {
        type: DataTypes.BOOLEAN,
        field: 'buy_box_is_fba',
      },
      buyBoxUnqualified: {
        type: DataTypes.BOOLEAN,
      },
      urlAmazon: {
        type: DataTypes.STRING(500),
      },
      urlKeepa: {
        type: DataTypes.STRING(500),
      },
      categoriesSub: {
        type: DataTypes.STRING(500),
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
