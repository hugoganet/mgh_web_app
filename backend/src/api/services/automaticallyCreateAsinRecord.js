/* eslint-disable require-jsdoc */
const db = require('../models/index');
const {
  getCatalogItem,
} = require('../../integrations/sp_api/catalog_api/operations/getCatalogItem');
const {
  getCountryCodeFromMarketplaceId,
} = require('../../utils/getCountryCodeFromMarketplaceId');
const { logAndCollect } = require('../../integrations/sp_api/logs/logger');

async function automaticallyCreateAsinRecord(
  asin,
  marketplaceIds,
  createLog = false,
) {
  let logMessage = 'Starting automaticallyCreateAsinRecord\n';
  try {
    const countryCode = getCountryCodeFromMarketplaceId(marketplaceIds);
    console.log(countryCode);

    // check for similar Asins in different countries and store the asinIds in an array
    const similarAsin = await db.Asin.findOne({
      where: {
        asin,
        countryCode: { [db.Sequelize.Op.ne]: countryCode },
      },
    });

    if (similarAsin) {
      const asinData = similarAsin.toJSON();
      console.log(asinData);
      logMessage += `Found similar asin in ${
        asinData.countryCode
      } : ${JSON.stringify(asinData, '', 2)}\n`;
    }

    // get the catalogItem
    let catalogItem;
    try {
      catalogItem = await getCatalogItem(asin, marketplaceIds, true);
    } catch (error) {
      console.error(error);
    }

    if (
      catalogItem &&
      catalogItem.salesRanks &&
      catalogItem.salesRanks.length > 0
    ) {
      const salesRanksData = catalogItem.salesRanks[0];
      if (salesRanksData.ranks && salesRanks.ranks.length > 0) {
        const salesRank = salesRanksData.ranks[0].ranks;
        console.log(salesRank);
      } else {
        console.log('No ranks data available');
      }
    } else {
      console.log('No salesRanks data available');
    }

    const productCategoryRankId = await getProductCategoryRankId(
      similarAsin.productCategoryId,
      countryCode,
      salesRank,
    );

    asinRecord = {
      asin: asin,
      countryCode,
      productCategoryId: similarAsin.productCategoryId,
      productCategoryRankId,
      productTaxCategoryId: 1,
      asinPreparation: 'test',
      urlAmazon: 'test',
      urlImage: 'test',
      asinName: 'test',
      asinNumberOfActiveSku: 1,
      asinAverageUnitSoldPerDay: 1,
      isBatteryRequired: false,
      isHazmat: false,
    };
    try {
      // await db.Asin.create(asinRecord);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    logMessage += `Overall error in automaticallyCreateAsinRecord: ${error}\n`;
    console.error('Error automaticallyCreateAsinRecord:', error);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'automaticallyCreateAsinRecord');
    }
  }
}

module.exports = {
  automaticallyCreateAsinRecord,
};

// // ASIN test for Turkey
// const asin = 'B09NZD9S1M';
// const marketplaceIds = 'A33AVAJ2PDY3EV';

// ASIN test for France
const asin = 'B005LH2FA0';
// const asin = 'B08YNZHB8S'; // composed of 2 EANS
const marketplaceIds = 'A33AVAJ2PDY3EV';

automaticallyCreateAsinRecord(asin, marketplaceIds, true);
