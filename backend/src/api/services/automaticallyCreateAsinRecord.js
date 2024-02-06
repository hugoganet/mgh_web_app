const db = require('../models/index');
const {
  getCatalogItem,
} = require('../../integrations/sp_api/catalog_api/operations/getCatalogItem');
const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');
const { logger } = require('../../utils/logger');
const { getProductCategoryRankId } = require('./getProductCategoryRankId');
const { getProductTaxCategoryName } = require('./getProductTaxCategoryName');
const {
  automaticallyCreateEanInAsinRecord,
} = require('./automaticallyCreateEanInAsinRecord');
const {
  automaticallyCreateFbaFeesRecord,
} = require('./automaticallyCreateFbaFeesRecord');
const { extractPackageDimensions } = require('./extractPackageDimensions');
const { createUrlAmazon } = require('./createUrlAmazon');

/**
 * Creates an ASIN record in the database if it does not exist.
 * @async
 * @param {string} asin - The ASIN to create a record for.
 * @param {string} [marketplaceId] - Optional Marketplace ID associated with the ASIN.
 * @param {string} [countryCode] - Optional country code associated with the ASIN.
 * @param {boolean} createLog - Whether to create a log for this operation.
 * @param {string} logContext - The context for the log message.
 * @throws Will throw an error if neither marketplaceId nor countryCode is provided.
 */
async function automaticallyCreateAsinRecord(
  asin,
  marketplaceId = null,
  countryCode = null,
  createLog = false,
  logContext = 'automaticallyCreateAsinRecord',
) {
  // Early validation if both marketplaceId and countryCode are missing
  if (!marketplaceId && !countryCode) {
    const errorMessage =
      'Error: Both marketplaceId and countryCode cannot be null.';
    console.error(errorMessage);
    if (createLog) {
      logger(errorMessage, logContext);
    }
    return;
  }

  try {
    let conversionResult;
    if (marketplaceId) {
      conversionResult = convertMarketplaceIdentifier(
        marketplaceId,
        createLog,
        logContext,
      );
    } else if (countryCode) {
      conversionResult = convertMarketplaceIdentifier(
        countryCode,
        createLog,
        logContext,
      );
    }
    countryCode = conversionResult.countryCode;
    marketplaceId = conversionResult.marketplaceId;

    const similarAsin = await db.Asin.findOne({
      where: {
        asin,
        countryCode: { [db.Sequelize.Op.ne]: countryCode },
      },
    });

    if (similarAsin) {
      logMessage += `Found similar asin in ${similarAsin.countryCode} with asinId : ${similarAsin.asinId}\n`;
    } else {
      console.log("No similar asin found. Can't automatically create an ASIN");
      logMessage += `No similar asin found. Can't automatically create an ASIN\n`;
      return;
    }

    let catalogItem;
    try {
      catalogItem = await getCatalogItem(
        asin,
        marketplaceId,
        createLog,
        logContext,
      );
    } catch (error) {
      logMessage += `Error fetching catalog item: ${error}\n`;
      throw new Error(`Error fetching catalog item: ${error}`);
    }

    const { packageLength, packageWidth, packageHeight, packageWeight } =
      extractPackageDimensions(catalogItem, createLog);

    let salesRank = 0;
    if (catalogItem?.salesRanks?.[0]?.ranks?.[0]?.rank) {
      salesRank = catalogItem.salesRanks[0].ranks[0].rank;
    }
    logMessage += `Sales rank resolved: ${salesRank}\n`;

    let productCategoryRankId;
    if (
      countryCode !== 'FR' ||
      countryCode !== 'DE' ||
      countryCode !== 'IT' ||
      countryCode !== 'ES'
    ) {
      productCategoryRankId = null;
    } else {
      productCategoryRankId = await getProductCategoryRankId(
        similarAsin?.productCategoryId,
        countryCode,
        salesRank,
        createLog,
        logContext,
      );
    }

    const productTaxCategoryName = await getProductTaxCategoryName(
      similarAsin?.productTaxCategoryId,
      createLog,
      logContext,
    );

    const productTaxCategoryId = await db.ProductTaxCategory.findOne({
      where: {
        productTaxCategoryName,
        countryCode,
      },
    });

    const urlAmazon = await createUrlAmazon(
      asin,
      countryCode,
      createLog,
      logContext,
    );

    const asinRecord = {
      asin,
      countryCode,
      productCategoryId: similarAsin?.productCategoryId,
      productCategoryRankId,
      productTaxCategoryId: productTaxCategoryId?.productTaxCategoryId,
      asinPreparation: similarAsin?.asinPreparation,
      urlAmazon,
      urlImage: catalogItem.images[0].images[0].link,
      asinName: catalogItem.summaries[0].itemName,
      asinNumberOfActiveSku: 1,
      asinAverageUnitSoldPerDay: 1,
      isBatteryRequired: similarAsin?.isBatteryRequired,
      isHazmat: similarAsin?.isHazmat,
    };

    try {
      const newAsin = await db.Asin.create(asinRecord);
      logMessage += `ASIN record created successfully with id : ${newAsin.asinId}.\n`;
      try {
        if (similarAsin) {
          await automaticallyCreateEanInAsinRecord(
            similarAsin.asinId,
            newAsin.asinId,
            createLog,
          );
        }
        logMessage += `EAN in ASIN record created successfully.\n`;
      } catch (error) {
        logMessage += `Error automatically creating EAN in ASIN record: ${error}\n`;
        throw new Error(
          `Error automatically creating EAN in ASIN record: ${error}`,
        );
      }
      try {
        if (countryCode !== 'TR') {
          await automaticallyCreateFbaFeesRecord(
            packageLength,
            packageWidth,
            packageHeight,
            packageWeight,
            (newlyCreatedAsinId = newAsin.asinId),
            countryCode,
            createLog,
            logContext,
          );
          logMessage += `FBA fees record created successfully.\n`;
        }
      } catch (error) {
        logMessage += `Error automatically creating FBA fees record: ${error}\n`;
        throw new Error(
          `Error automatically creating FBA fees record: ${error}`,
        );
      }
      return newAsin;
    } catch (error) {
      logMessage += `Error creating ASIN record in the database: ${error}
      asinRecord : ${JSON.stringify(asinRecord, '', 2)}\n`;
      throw new Error(`Error creating ASIN record in the database: ${error}`);
    }
  } catch (error) {
    logMessage += `Overall error in automaticallyCreateAsinRecord: ${error}\n`;
    console.error('Error automaticallyCreateAsinRecord:', error);
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  automaticallyCreateAsinRecord,
};

// Test with sample ASINs
// const asin = 'B005LH2FA0';
// const marketplaceId = 'A1PA6795UKMFR9'; // DE
// const marketplaceId = 'A1RKKUPIHCS9HS'; // ES
// const marketplaceId = 'A1F83G8C2ARO7P'; // UK

// // exemple Parrot DE
// const asin = 'B07HS6PBJX';
// const marketplaceId = 'A1PA6795UKMFR9'; // DE

// // exemple Schwarzkopf SE
// const asin = 'B07DYYGK7V';
// const countryCode = 'SE';
// const marketplaceId = null; // SE
// const marketplaceId = 'A2NODRKZP88ZB9'; // SE

// const asin = 'B0CM25Y89L';
// const marketplaceId = 'A33AVAJ2PDY3EV'; // TR
// automaticallyCreateAsinRecord(asin, marketplaceId, countryCode, true);
