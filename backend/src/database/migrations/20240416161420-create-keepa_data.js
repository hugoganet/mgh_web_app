/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('keepa_data', {
      keepaDataId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.CHAR(2),
        allowNull: false,
      },
      urlImage: {
        type: Sequelize.STRING(500),
      },
      productName: {
        type: Sequelize.STRING(250),
      },
      salesRanking30DaysAvg: {
        type: Sequelize.INTEGER,
      },
      salesRanking90DaysAvg: {
        type: Sequelize.INTEGER,
      },
      salesRanking180DaysAvg: {
        type: Sequelize.INTEGER,
      },
      productCategory: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_category',
          key: 'productCategoryId',
        },
      },
      reviewsRating: {
        type: Sequelize.DECIMAL(10, 2),
      },
      reviewsCount: {
        type: Sequelize.INTEGER,
      },
      amazonCurrent: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon30DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon90DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon180DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazonLowest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazonHighest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amazon90DaysOOS: {
        type: Sequelize.INTEGER,
      },
      newCurrent: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new30DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new90DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      new180DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBACurrent: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBA30DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBA90DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBA180DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBALowest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fbaPickPackFee: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBMCurrent: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBM30DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBM90DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newThirdPartyFBM180DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      newOffersCurrentCount: {
        type: Sequelize.INTEGER,
      },
      newOffers90DaysAvgCount: {
        type: Sequelize.INTEGER,
      },
      countRetrievedLiveOffersNewFBA: {
        type: Sequelize.INTEGER,
      },
      countRetrievedLiveOffersNewFBM: {
        type: Sequelize.INTEGER,
      },
      buyBoxCurrent: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buyBox30DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buyBox90DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buyBox180DaysAvg: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buyBoxLowest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buyBoxHighest: {
        type: Sequelize.DECIMAL(10, 2),
      },
      buyBoxSeller: {
        type: Sequelize.STRING(100),
      },
      buyBoxIsFBA: {
        type: Sequelize.BOOLEAN,
      },
      buyBoxUnqualified: {
        type: Sequelize.BOOLEAN,
      },
      urlAmazon: {
        type: Sequelize.STRING(500),
      },
      urlKeepa: {
        type: Sequelize.STRING(500),
      },
      categoriesRoot: {
        type: Sequelize.STRING(150),
      },
      categoriesSub: {
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
      numberOfItems: {
        type: Sequelize.INTEGER,
      },
      packageLengthCm: {
        type: Sequelize.INTEGER,
      },
      packageWidthCm: {
        type: Sequelize.INTEGER,
      },
      packageHeightCm: {
        type: Sequelize.INTEGER,
      },
      packageWeightG: {
        type: Sequelize.INTEGER,
      },
      isHazmat: {
        type: Sequelize.BOOLEAN,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('keepa_data');
  },
};
