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
      urlImage: {
        type: DataTypes.STRING(500),
      },
      asin: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      ean: {
        type: DataTypes.CHAR(13),
      },
      brand: {
        type: DataTypes.STRING(100),
      },
      productName: {
        type: DataTypes.STRING(250),
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
      },
      salesRanking90DaysAvg: {
        type: DataTypes.INTEGER,
      },
      salesRanking180DaysAvg: {
        type: DataTypes.INTEGER,
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
      },
      amazon90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      amazon180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      amazonLowest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      amazonHighest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      amazon90DaysOOS: {
        type: DataTypes.INTEGER,
      },
      newCurrent: {
        type: DataTypes.DECIMAL(10, 2),
      },
      new30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      new90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      new180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBACurrent: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBA30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBA90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBA180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBALowest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaPickPackFee: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBMCurrent: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBM30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBM90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newThirdPartyFBM180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      newOffersCurrentCount: {
        type: DataTypes.INTEGER,
      },
      newOffers90DaysAvgCount: {
        type: DataTypes.INTEGER,
      },
      countRetrievedLiveOffersNewFBA: {
        type: DataTypes.INTEGER,
      },
      countRetrievedLiveOffersNewFBM: {
        type: DataTypes.INTEGER,
      },
      buyBoxCurrent: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBox30DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBox90DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBox180DaysAvg: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBoxLowest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBoxHighest: {
        type: DataTypes.DECIMAL(10, 2),
      },
      buyBoxSeller: {
        type: DataTypes.STRING(100),
      },
      buyBoxIsFBA: {
        type: DataTypes.BOOLEAN,
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
        type: DataTypes.STRING(150),
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
    },
  );

  return KeepaData;
};
