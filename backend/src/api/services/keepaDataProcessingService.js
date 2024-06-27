const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { logger } = require('../../utils/logger');
const db = require('../../database/models/index');
const {
  parseAndValidateNumber,
} = require('../../utils/parseAndValidateNumber');
const getProductCategoryId = require('./getProductCategoryId');

const processKeepaDataFile = async (
  filePath,
  createLog = false,
  logContext = 'keepaProcessingService',
  flushBuffer = false,
) => {
  const results = [];
  const errors = [];
  const duplicates = new Set();
  const missingProductCategories = [];
  const existingCombos = new Set();
  let logMessage = '';

  const fileStream = fs.createReadStream(filePath);
  const csvStream = fileStream.pipe(csv());

  for await (const data of csvStream) {
    try {
      const countryCode = data.Locale.toUpperCase();
      const asin = data.ASIN;
      const comboKey = `${asin}-${countryCode}`;

      if (existingCombos.has(comboKey)) {
        duplicates.add(comboKey);
        logMessage += `Duplicate ASIN: ${asin} for ${countryCode} in the batch.`;
        continue;
      }
      existingCombos.add(comboKey);

      const productCategoryId = await getProductCategoryId(
        data['Categories: Root'],
        countryCode,
        createLog,
        logContext,
        flushBuffer,
      );

      if (!productCategoryId) {
        missingProductCategories.push({
          asin,
          productCategory: data['Categories: Root'],
          reason: 'No valid product category ID found',
        });
        logMessage += `Missing category for ASIN: ${asin} with category: ${data['Categories: Root']}`;
        continue;
      }

      const mappedData = {
        countryCode,
        urlImage: data.Image,
        asin,
        ean: data['Product Codes: EAN'],
        upc: data['Product Codes: UPC'],
        partNumber: data['Product Codes: PartNumber'],
        variationASINs: data['Variation ASINs'],
        freqBoughtTogether: data['Freq. Bought Together'],
        manufacturer: data['Manufacturer'],
        brand: data['Brand'],
        productName: data.Title,
        variationAttributes: data['Variation Attributes'],
        salesRankingCurrent: parseAndValidateNumber(
          data['Sales Rank: Current'],
          { min: 0, paramName: 'salesRankingCurrent', allowNull: true },
        ),
        salesRanking30DaysAvg: parseAndValidateNumber(
          data['Sales Rank: 30 days avg.'],
          { min: 0, paramName: 'salesRanking30DaysAvg', allowNull: true },
        ),
        salesRanking90DaysAvg: parseAndValidateNumber(
          data['Sales Rank: 90 days avg.'],
          { min: 0, paramName: 'salesRanking90DaysAvg', allowNull: true },
        ),
        salesRanking180DaysAvg: parseAndValidateNumber(
          data['Sales Rank: 180 days avg.'],
          {
            min: 0,
            paramName: 'salesRanking180DaysAvg',
            allowNull: true,
          },
        ),
        productCategoryId,
        reviewsRating: parseAndValidateNumber(data['Reviews: Rating'], {
          min: 0,
          max: 5,
          decimals: 2,
          paramName: 'reviewsRating',
          allowNull: true,
        }),
        reviewsCount: parseAndValidateNumber(data['Reviews: Review Count'], {
          min: 0,
          decimals: 0,
          paramName: 'reviewsCount',
          allowNull: true,
        }),
        reviewsCount30DaysAvg: parseAndValidateNumber(
          data['Reviews: Review Count - 30 days avg.'],
          {
            min: 0,
            decimals: 0,
            paramName: 'reviewsCount30DaysAvg',
            allowNull: true,
          },
        ),
        reviewsCount90DaysAvg: parseAndValidateNumber(
          data['Reviews: Review Count - 90 days avg.'],
          {
            min: 0,
            decimals: 0,
            paramName: 'reviewsCount90DaysAvg',
            allowNull: true,
          },
        ),
        reviewsCount180DaysAvg: parseAndValidateNumber(
          data['Reviews: Review Count - 180 days avg.'],
          {
            min: 0,
            decimals: 0,
            paramName: 'reviewsCount180DaysAvg',
            allowNull: true,
          },
        ),
        amazonCurrent: parseAndValidateNumber(data['Amazon: Current'], {
          min: 0,
          decimals: 2,
          paramName: 'amazonCurrent',
          allowNull: true,
        }),
        amazon30DaysAvg: parseAndValidateNumber(data['Amazon: 30 days avg.'], {
          min: 0,
          decimals: 2,
          paramName: 'amazon30DaysAvg',
          allowNull: true,
        }),
        amazon90DaysAvg: parseAndValidateNumber(data['Amazon: 90 days avg.'], {
          min: 0,
          decimals: 2,
          paramName: 'amazon90DaysAvg',
          allowNull: true,
        }),
        amazon180DaysAvg: parseAndValidateNumber(
          data['Amazon: 180 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'amazon180DaysAvg',
            allowNull: true,
          },
        ),
        amazonLowest: parseAndValidateNumber(data['Amazon: Lowest'], {
          min: 0,
          decimals: 2,
          paramName: 'amazonLowest',
          allowNull: true,
        }),
        amazonHighest: parseAndValidateNumber(data['Amazon: Highest'], {
          min: 0,
          decimals: 2,
          paramName: 'amazonHighest',
          allowNull: true,
        }),
        amazon90DaysOOS: parseAndValidateNumber(data['Amazon: 90 days OOS'], {
          min: 0,
          max: 1,
          decimals: 5,
          paramName: 'amazon90DaysOOS',
          allowNull: true,
        }),
        mapRestriction: data['MAP restriction'],
        newCurrent: parseAndValidateNumber(data['New: Current'], {
          min: 0,
          decimals: 2,
          paramName: 'newCurrent',
          allowNull: true,
        }),
        new30DaysAvg: parseAndValidateNumber(data['New: 30 days avg.'], {
          min: 0,
          decimals: 2,
          paramName: 'new30DaysAvg',
          allowNull: true,
        }),
        new90DaysAvg: parseAndValidateNumber(data['New: 90 days avg.'], {
          min: 0,
          decimals: 2,
          paramName: 'new90DaysAvg',
          allowNull: true,
        }),
        new180DaysAvg: parseAndValidateNumber(data['New: 180 days avg.'], {
          min: 0,
          decimals: 2,
          paramName: 'new180DaysAvg',
          allowNull: true,
        }),
        newThirdPartyFBACurrent: parseAndValidateNumber(
          data['New, 3rd Party FBA: Current'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBACurrent',
            allowNull: true,
          },
        ),
        newThirdPartyFBA30DaysAvg: parseAndValidateNumber(
          data['New, 3rd Party FBA: 30 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBA30DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBA90DaysAvg: parseAndValidateNumber(
          data['New, 3rd Party FBA: 90 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBA90DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBA180DaysAvg: parseAndValidateNumber(
          data['New, 3rd Party FBA: 180 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBA180DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBALowest: parseAndValidateNumber(
          data['New, 3rd Party FBA: Lowest'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBALowest',
            allowNull: true,
          },
        ),
        lowestFBASeller: data['Lowest FBA Seller'],
        fbaPickPackFee: parseAndValidateNumber(data['FBA Pick&Pack Fee'], {
          min: 0,
          decimals: 2,
          paramName: 'fbaPickPackFee',
          allowNull: true,
        }),
        newThirdPartyFBMCurrent: parseAndValidateNumber(
          data['New, 3rd Party FBM 🚚: Current'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBMCurrent',
            allowNull: true,
          },
        ),
        newThirdPartyFBM30DaysAvg: parseAndValidateNumber(
          data['New, 3rd Party FBM 🚚: 30 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBM30DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBM90DaysAvg: parseAndValidateNumber(
          data['New, 3rd Party FBM 🚚: 90 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBM90DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBM180DaysAvg: parseAndValidateNumber(
          data['New, 3rd Party FBM 🚚: 180 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBM180DaysAvg',
            allowNull: true,
          },
        ),
        listPriceCurrent: parseAndValidateNumber(data['List Price: Current'], {
          min: 0,
          decimals: 2,
          paramName: 'listPriceCurrent',
          allowNull: true,
        }),
        listPrice30DaysAvg: parseAndValidateNumber(
          data['List Price: 30 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'listPrice30DaysAvg',
            allowNull: true,
          },
        ),
        listPrice90DaysAvg: parseAndValidateNumber(
          data['List Price: 90 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'listPrice90DaysAvg',
            allowNull: true,
          },
        ),
        listPrice180DaysAvg: parseAndValidateNumber(
          data['List Price: 180 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'listPrice180DaysAvg',
            allowNull: true,
          },
        ),
        listPrice30DaysDropPercent: parseAndValidateNumber(
          data['List Price: 30 days drop %'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'listPrice30DaysDropPercent',
            allowNull: true,
          },
        ),
        listPrice90DaysDropPercent: parseAndValidateNumber(
          data['List Price: 90 days drop %'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'listPrice90DaysDropPercent',
            allowNull: true,
          },
        ),
        listPriceLowest: parseAndValidateNumber(data['List Price: Lowest'], {
          min: 0,
          decimals: 2,
          paramName: 'listPriceLowest',
          allowNull: true,
        }),
        listPriceHighest: parseAndValidateNumber(data['List Price: Highest'], {
          min: 0,
          decimals: 2,
          paramName: 'listPriceHighest',
          allowNull: true,
        }),
        newOfferCount30DaysAvg: parseAndValidateNumber(
          data['New Offer Count: 30 days avg.'],
          {
            min: 0,
            decimals: 0,
            paramName: 'newOfferCount30DaysAvg',
            allowNull: true,
          },
        ),
        newOfferCount180DaysAvg: parseAndValidateNumber(
          data['New Offer Count: 180 days avg.'],
          {
            min: 0,
            decimals: 0,
            paramName: 'newOfferCount180DaysAvg',
            allowNull: true,
          },
        ),
        trackingSince: data['Tracking since'],
        listedSince: data['Listed since'],
        urlAmazon: data['URL: Amazon'],
        urlKeepa: data['URL: Keepa'],
        categoriesRoot: data['Categories: Root'],
        categoriesSub: data['Categories: Sub'],
        numberOfItems: parseAndValidateNumber(data['Number of Items'], {
          min: 0,
          decimals: 0,
          paramName: 'numberOfItems',
          allowNull: true,
        }),
        packageLengthCm: parseAndValidateNumber(data['Package: Length (cm)'], {
          min: 0,
          decimals: 0,
          paramName: 'packageLengthCm',
          allowNull: true,
        }),
        packageWidthCm: parseAndValidateNumber(data['Package: Width (cm)'], {
          min: 0,
          decimals: 0,
          paramName: 'packageWidthCm',
          allowNull: true,
        }),
        packageHeightCm: parseAndValidateNumber(data['Package: Height (cm)'], {
          min: 0,
          decimals: 0,
          paramName: 'packageHeightCm',
          allowNull: true,
        }),
        packageWeightG: parseAndValidateNumber(data['Package: Weight (g)'], {
          min: 0,
          decimals: 0,
          paramName: 'packageWeightG',
          allowNull: true,
        }),
        itemDimensionCm3: parseAndValidateNumber(
          data['Item: Dimension (cm³)'],
          {
            min: 0,
            decimals: 0,
            paramName: 'itemDimensionCm3',
            allowNull: true,
          },
        ),
        itemLengthCm: parseAndValidateNumber(data['Item: Length (cm)'], {
          min: 0,
          decimals: 0,
          paramName: 'itemLengthCm',
          allowNull: true,
        }),
        itemWidthCm: parseAndValidateNumber(data['Item: Width (cm)'], {
          min: 0,
          decimals: 0,
          paramName: 'itemWidthCm',
          allowNull: true,
        }),
        itemHeightCm: parseAndValidateNumber(data['Item: Height (cm)'], {
          min: 0,
          decimals: 0,
          paramName: 'itemHeightCm',
          allowNull: true,
        }),
        itemWeightG: parseAndValidateNumber(data['Item: Weight (g)'], {
          min: 0,
          decimals: 0,
          paramName: 'itemWeightG',
          allowNull: true,
        }),
        description: data['Description & Features: Description'],
        feature1: data['Description & Features: Feature 1'],
        feature2: data['Description & Features: Feature 2'],
        feature3: data['Description & Features: Feature 3'],
        feature4: data['Description & Features: Feature 4'],
        feature5: data['Description & Features: Feature 5'],
        feature6: data['Description & Features: Feature 6'],
        feature7: data['Description & Features: Feature 7'],
        feature8: data['Description & Features: Feature 8'],
        feature9: data['Description & Features: Feature 9'],
        feature10: data['Description & Features: Feature 10'],
        contributors: data['Contributors'],
        packageQuantity: parseAndValidateNumber(data['Package: Quantity'], {
          min: 0,
          decimals: 0,
          paramName: 'packageQuantity',
          allowNull: true,
        }),
        referralFeeBuyBoxPrice: parseAndValidateNumber(
          data['Referral Fee based on current Buy Box price'],
          {
            min: 0,
            decimals: 2,
            paramName: 'referralFeeBuyBoxPrice',
            allowNull: true,
          },
        ),
        imageCount: parseAndValidateNumber(data['Image Count'], {
          min: 0,
          decimals: 0,
          paramName: 'imageCount',
          allowNull: true,
        }),
        buyBoxPercentAmazon30Days: parseAndValidateNumber(
          data['Buy Box: % Amazon 30 days'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'buyBoxPercentAmazon30Days',
            allowNull: true,
          },
        ),
        buyBoxPercentAmazon90Days: parseAndValidateNumber(
          data['Buy Box: % Amazon 90 days'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'buyBoxPercentAmazon90Days',
            allowNull: true,
          },
        ),
        buyBoxPercentAmazon180Days: parseAndValidateNumber(
          data['Buy Box: % Amazon 180 days'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'buyBoxPercentAmazon180Days',
            allowNull: true,
          },
        ),
        buyBoxPercentAmazon365Days: parseAndValidateNumber(
          data['Buy Box: % Amazon 365 days'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'buyBoxPercentAmazon365Days',
            allowNull: true,
          },
        ),
        buyBoxPercentTopSeller30Days: parseAndValidateNumber(
          data['Buy Box: % Top Seller 30 days'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'buyBoxPercentTopSeller30Days',
            allowNull: true,
          },
        ),
        buyBoxPercentTopSeller90Days: parseAndValidateNumber(
          data['Buy Box: % Top Seller 90 days'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'buyBoxPercentTopSeller90Days',
            allowNull: true,
          },
        ),
        buyBoxPercentTopSeller180Days: parseAndValidateNumber(
          data['Buy Box: % Top Seller 180 days'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'buyBoxPercentTopSeller180Days',
            allowNull: true,
          },
        ),
        buyBoxPercentTopSeller365Days: parseAndValidateNumber(
          data['Buy Box: % Top Seller 365 days'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'buyBoxPercentTopSeller365Days',
            allowNull: true,
          },
        ),
        buyBoxWinnerCount30Days: parseAndValidateNumber(
          data['Buy Box: Winner Count 30 days'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxWinnerCount30Days',
            allowNull: true,
          },
        ),
        buyBoxWinnerCount90Days: parseAndValidateNumber(
          data['Buy Box: Winner Count 90 days'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxWinnerCount90Days',
            allowNull: true,
          },
        ),
        buyBoxWinnerCount180Days: parseAndValidateNumber(
          data['Buy Box: Winner Count 180 days'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxWinnerCount180Days',
            allowNull: true,
          },
        ),
        buyBoxWinnerCount365Days: parseAndValidateNumber(
          data['Buy Box: Winner Count 365 days'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxWinnerCount365Days',
            allowNull: true,
          },
        ),
        competitivePriceThreshold: parseAndValidateNumber(
          data['Competitive Price Threshold'],
          {
            min: 0,
            decimals: 2,
            paramName: 'competitivePriceThreshold',
            allowNull: true,
          },
        ),
        suggestedLowerPrice: parseAndValidateNumber(
          data['Suggested Lower Price'],
          {
            min: 0,
            decimals: 2,
            paramName: 'suggestedLowerPrice',
            allowNull: true,
          },
        ),
        buyBoxEligibleOfferCountsNewFBA: parseAndValidateNumber(
          data['Buy Box Eligible Offer Counts: New FBA'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxEligibleOfferCountsNewFBA',
            allowNull: true,
          },
        ),
        buyBoxEligibleOfferCountsNewFBM: parseAndValidateNumber(
          data['Buy Box Eligible Offer Counts: New FBM'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxEligibleOfferCountsNewFBM',
            allowNull: true,
          },
        ),
        buyBoxEligibleOfferCountsUsedFBA: parseAndValidateNumber(
          data['Buy Box Eligible Offer Counts: Used FBA'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxEligibleOfferCountsUsedFBA',
            allowNull: true,
          },
        ),
        buyBoxEligibleOfferCountsUsedFBM: parseAndValidateNumber(
          data['Buy Box Eligible Offer Counts: Used FBM'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxEligibleOfferCountsUsedFBM',
            allowNull: true,
          },
        ),
        buyBoxEligibleOfferCountsCollectibleFBA: parseAndValidateNumber(
          data['Buy Box Eligible Offer Counts: Collectible FBA'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxEligibleOfferCountsCollectibleFBA',
            allowNull: true,
          },
        ),
        buyBoxEligibleOfferCountsCollectibleFBM: parseAndValidateNumber(
          data['Buy Box Eligible Offer Counts: Collectible FBM'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxEligibleOfferCountsCollectibleFBM',
            allowNull: true,
          },
        ),
        buyBoxEligibleOfferCountsRefurbishedFBA: parseAndValidateNumber(
          data['Buy Box Eligible Offer Counts: Refurbished FBA'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxEligibleOfferCountsRefurbishedFBA',
            allowNull: true,
          },
        ),
        buyBoxEligibleOfferCountsRefurbishedFBM: parseAndValidateNumber(
          data['Buy Box Eligible Offer Counts: Refurbished FBM'],
          {
            min: 0,
            decimals: 0,
            paramName: 'buyBoxEligibleOfferCountsRefurbishedFBM',
            allowNull: true,
          },
        ),
        listPrice1DayDropPercent: parseAndValidateNumber(
          data['List Price: 1 day drop %'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'listPrice1DayDropPercent',
            allowNull: true,
          },
        ),
        listPrice7DaysDropPercent: parseAndValidateNumber(
          data['List Price: 7 days drop %'],
          {
            min: 0,
            max: 1,
            decimals: 5,
            paramName: 'listPrice7DaysDropPercent',
            allowNull: true,
          },
        ),
        importedByCode: data['Imported by Code'],
        variationCount: parseAndValidateNumber(data['Variation Count'], {
          min: 0,
          decimals: 0,
          paramName: 'variationCount',
          allowNull: true,
        }),
        type: data['Type'],
        hazardousMaterials: data['Hazardous Materials'],
        isHazmat: data['Is HazMat'] === 'true',
      };

      results.push(mappedData);
    } catch (error) {
      errors.push({ error: error.message, row: data });
      logMessage += `Error processing row: ${JSON.stringify(
        error.message,
        null,
        2,
      )}`;
    }
  }

  try {
    if (results.length > 0) {
      const insertResult = await db.KeepaData.bulkCreate(results, {
        ignoreDuplicates: true,
      });
      logMessage += `Keepa data processed successfully. ${insertResult.length} records inserted.`;
    }
  } catch (error) {
    logMessage += `Error during bulk insert: ${JSON.stringify(
      error.message,
      null,
      2,
    )}`;
  } finally {
    if (createLog) {
      logger(logMessage, logContext, flushBuffer);
    }

    return {
      message: 'Keepa data processed successfully.',
      processed: results.length,
      duplicates: duplicates.size,
      missingProductCategories: missingProductCategories.length,
      errors: errors.length,
    };
  }
};

module.exports = { processKeepaDataFile };

if (require.main === module) {
  const filePath = path.resolve(
    __dirname,
    '../../../uploads/file-1713591845018.csv',
  );
  processKeepaDataFile(filePath, true, 'keepaProcessingService', true).then(
    result => console.log(result),
  );
}
