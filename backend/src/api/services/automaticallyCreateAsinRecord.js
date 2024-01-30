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
const {
  mapSalesChannelOrCountryCode,
} = require('../../utils/mapSalesChannelOrCountryCode');

/**
 * @description This function creates an ASIN record in the database if it does not exist.
 * @function automaticallyCreateAsinRecord
 * @param {string} asin - ASIN to create a record for
 * @param {string} marketplaceIds - Marketplace ID to create a record for
 * @param {boolean} createLog - Whether to create a log for this operation
 */
async function automaticallyCreateAsinRecord(
  asin,
  marketplaceIds,
  createLog = false,
) {
  let logMessage = 'Starting automaticallyCreateAsinRecord\n';
  try {
    const countryCode = getCountryCodeFromMarketplaceId(marketplaceIds);
    logMessage += `Country code resolved: ${countryCode}\n`;

    const similarAsin = await db.Asin.findOne({
      where: {
        asin,
        countryCode: { [db.Sequelize.Op.ne]: countryCode },
      },
    });

    if (similarAsin) {
      logMessage += `Found similar asin in ${similarAsin.countryCode}\n`;
    }

    let catalogItem;
    try {
      catalogItem = await getCatalogItem(asin, marketplaceIds, createLog);
    } catch (error) {
      logMessage += `Error fetching catalog item: ${error}\n`;
      throw new Error(`Error fetching catalog item: ${error}`);
    }

    let salesRank = 0;
    if (catalogItem?.salesRanks?.[0]?.ranks?.[0]?.rank) {
      salesRank = catalogItem.salesRanks[0].ranks[0].rank;
    }
    logMessage += `Sales rank resolved: ${salesRank}\n`;

    const productCategoryRankId = await getProductCategoryRankId(
      similarAsin?.productCategoryId,
      countryCode,
      salesRank,
    );
    const productTaxCategoryName = await getProductTaxCategoryName(
      similarAsin?.productTaxCategoryId,
    );

    const productTaxCategoryId = await db.ProductTaxCategory.findOne({
      where: {
        productTaxCategoryName,
        countryCode,
      },
    });

    const urlImage = catalogItem.images[0].images[0].link;
    const asinName = catalogItem.summaries[0].itemName;

    let marketplaceDomain;
    try {
      marketplaceDomain = await mapSalesChannelOrCountryCode(
        countryCode,
        'countryCodeToMarketplaceDomain',
      );
    } catch (error) {
      logMessage += `Error mapping country code to marketplace domain: ${error}\n`;
      throw new Error(
        `Error mapping country code to marketplace domain: ${error}`,
      );
    }

    let urlAmazon;
    if (marketplaceDomain) {
      marketplaceDomain = marketplaceDomain.toLowerCase();
      urlAmazon = `https://${marketplaceDomain}/dp/${asin}`;
    } else {
      logMessage += `Marketplace domain not found for country code ${countryCode}\n`;
    }

    const asinRecord = {
      asin,
      countryCode,
      productCategoryId: similarAsin?.productCategoryId,
      productCategoryRankId,
      productTaxCategoryId: productTaxCategoryId?.productTaxCategoryId,
      asinPreparation: similarAsin?.asinPreparation,
      urlAmazon,
      urlImage,
      asinName,
      asinNumberOfActiveSku: 1,
      asinAverageUnitSoldPerDay: 1,
      isBatteryRequired: false,
      isHazmat: false,
    };

    try {
      await db.Asin.create(asinRecord);
      logMessage += 'ASIN record created successfully.\n';
    } catch (error) {
      logMessage += `Error creating ASIN record in the database: ${error}\n`;
      throw new Error(`Error creating ASIN record in the database: ${error}`);
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

// Test with sample ASINs
const asin = 'B005LH2FA0';
const marketplaceIds = 'A1PA6795UKMFR9';
automaticallyCreateAsinRecord(asin, marketplaceIds, true);
