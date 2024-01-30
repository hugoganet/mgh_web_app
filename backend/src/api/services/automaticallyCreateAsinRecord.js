/* eslint-disable require-jsdoc */
const db = require('../models/index');
const {
  getCatalogItem,
} = require('../../integrations/sp_api/catalog_api/operations/getCatalogItem');
const {
  getCountryCodeFromMarketplaceId,
} = require('../../utils/getCountryCodeFromMarketplaceId');
const { logAndCollect } = require('../../integrations/sp_api/logs/logger');
const {
  getProductCategoryRankId,
} = require('../services/getProductCategoryRankId');
const {
  getProductTaxCategoryName,
} = require('../services/getProductTaxCategoryName');

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

    let salesRank;
    if (
      catalogItem &&
      catalogItem.salesRanks &&
      catalogItem.salesRanks.length > 0
    ) {
      const salesRanksData = catalogItem.salesRanks[0];
      if (salesRanksData.ranks && salesRanksData.ranks.length > 0) {
        salesRank = salesRanksData.ranks[0].rank;
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
      false,
    );

    const productTaxCategoryName = await getProductTaxCategoryName(
      similarAsin.productTaxCategoryId,
    );

    // find the productTaxCategoryId with the productTaxCategoryName and the countryCode
    const productTaxCategoryId = await db.ProductTaxCategory.findOne({
      where: {
        productTaxCategoryName,
        countryCode,
      },
    });

    const urlImage = catalogItem.images[0].images[0].link;

    const asinName = catalogItem.summaries[0].itemName;

    // To get the Amazon URL of the product, you would typically construct it using the ASIN and the marketplace domain.
    const marketplaceId = catalogItem.summaries[0].marketplaceId;
    let urlAmazon;

    // Example of constructing the URL for Amazon Germany (DE) marketplace
    if (marketplaceId === 'A1PA6795UKMFR9') {
      urlAmazon = `https://www.amazon.de/dp/${catalogItem.asin}`;
    }

    asinRecord = {
      asin,
      countryCode,
      productCategoryId: similarAsin.productCategoryId,
      productCategoryRankId,
      productTaxCategoryId,
      asinPreparation: similarAsin.asinPreparation,
      urlAmazon,
      urlImage,
      asinName,
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

const asin = 'B005LH2FA0';
// const asin = 'B08YNZHB8S'; // composed of 2 EANS
const marketplaceIds = 'A1PA6795UKMFR9'; // DE

automaticallyCreateAsinRecord(asin, marketplaceIds, true);
