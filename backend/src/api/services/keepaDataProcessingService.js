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

  const fileStream = fs.createReadStream(filePath);
  const csvStream = fileStream.pipe(csv());

  for await (const data of csvStream) {
    try {
      const countryCode = data.Locale.toUpperCase();
      const asin = data.ASIN;
      const comboKey = `${asin}-${countryCode}`;

      if (existingCombos.has(comboKey)) {
        duplicates.add(comboKey);
        if (createLog) {
          logger(
            `Duplicate ASIN: ${asin} for ${countryCode} in the batch.`,
            logContext,
            flushBuffer,
          );
        }
        continue;
      }
      existingCombos.add(comboKey);

      const productCategoryId = await getProductCategoryId(
        data['Catégories: Root'],
        countryCode,
        createLog,
        logContext,
        flushBuffer,
      );

      if (!productCategoryId) {
        missingProductCategories.push({
          asin,
          productCategory: data['Catégories: Root'],
          reason: 'No valid product category ID found',
        });
        if (createLog) {
          logger(
            `Missing category for ASIN: ${asin} with category: ${data['Catégories: Root']}`,
            logContext,
            flushBuffer,
          );
        }
        continue;
      }

      const mappedData = {
        countryCode,
        urlImage: data.Image,
        asin,
        ean: data['Product Codes: EAN'],
        brand: data['Brand'],
        productName: data.Titre,
        salesRanking30DaysAvg: parseAndValidateNumber(
          data['Classement des ventes: 30 days avg.'],
          { min: 0, paramName: 'salesRanking30DaysAvg', allowNull: true },
        ),
        salesRanking90DaysAvg: parseAndValidateNumber(
          data['Classement des ventes: 90 days avg.'],
          { min: 0, paramName: 'salesRanking90DaysAvg', allowNull: true },
        ),
        salesRanking180DaysAvg: parseAndValidateNumber(
          data['Classement des ventes: 180 days avg.'],
          {
            min: 0,
            paramName: 'salesRanking180DaysAvg',
            allowNull: true,
          },
        ),
        productCategoryId,
        reviewsRating: parseAndValidateNumber(data['Revues: Évaluation'], {
          min: 0,
          max: 5,
          decimals: 2,
          paramName: 'reviewsRating',
          allowNull: true,
        }),
        reviewsCount: parseAndValidateNumber(
          data['Reviews: Nombre de revu est'],
          {
            min: 0,
            decimals: 0,
            paramName: 'reviewsCount',
            allowNull: true,
          },
        ),
        amazonCurrent: parseAndValidateNumber(data['Amazon: Courant'], {
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
        newCurrent: parseAndValidateNumber(data['Nouveau: Courant'], {
          min: 0,
          decimals: 2,
          paramName: 'newCurrent',
          allowNull: true,
        }),
        new30DaysAvg: parseAndValidateNumber(data['Nouveau: 30 days avg.'], {
          min: 0,
          decimals: 2,
          paramName: 'new30DaysAvg',
          allowNull: true,
        }),
        new90DaysAvg: parseAndValidateNumber(data['Nouveau: 90 days avg.'], {
          min: 0,
          decimals: 2,
          paramName: 'new90DaysAvg',
          allowNull: true,
        }),
        new180DaysAvg: parseAndValidateNumber(data['Nouveau: 180 days avg.'], {
          min: 0,
          decimals: 2,
          paramName: 'new180DaysAvg',
          allowNull: true,
        }),
        newThirdPartyFBACurrent: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBA: Courant'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBACurrent',
            allowNull: true,
          },
        ),
        newThirdPartyFBA30DaysAvg: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBA: 30 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBA30DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBA90DaysAvg: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBA: 90 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBA90DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBA180DaysAvg: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBA: 180 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBA180DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBALowest: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBA: Lowest'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBALowest',
            allowNull: true,
          },
        ),
        fbaPickPackFee: parseAndValidateNumber(data['FBA Pick&Pack Fee'], {
          min: 0,
          decimals: 2,
          paramName: 'fbaPickPackFee',
          allowNull: true,
        }),
        newThirdPartyFBMCurrent: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBM 🚚: Courant'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBMCurrent',
            allowNull: true,
          },
        ),
        newThirdPartyFBM30DaysAvg: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBM 🚚: 30 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBM30DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBM90DaysAvg: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBM 🚚: 90 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBM90DaysAvg',
            allowNull: true,
          },
        ),
        newThirdPartyFBM180DaysAvg: parseAndValidateNumber(
          data['Nouveau, Tierce Partie FBM 🚚: 180 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'newThirdPartyFBM180DaysAvg',
            allowNull: true,
          },
        ),
        newOffersCurrentCount: parseAndValidateNumber(
          data["Nombre d'offre Neuf: Courant"],
          { min: 0, paramName: 'newOffersCurrentCount', allowNull: true },
        ),
        newOffers90DaysAvgCount: parseAndValidateNumber(
          data["Nombre d'offre Neuf: 90 days avg."],
          {
            min: 0,
            paramName: 'newOffers90DaysAvgCount',
            allowNull: true,
          },
        ),
        countRetrievedLiveOffersNewFBA: parseAndValidateNumber(
          data['Count of retrieved live offers: New, FBA'],
          {
            min: 0,
            paramName: 'countRetrievedLiveOffersNewFBA',
            allowNull: true,
          },
        ),
        countRetrievedLiveOffersNewFBM: parseAndValidateNumber(
          data['Count of retrieved live offers: New, FBM'],
          {
            min: 0,
            paramName: 'countRetrievedLiveOffersNewFBM',
            allowNull: true,
          },
        ),
        buyBoxCurrent: parseAndValidateNumber(data['Buy Box 🚚: Courant'], {
          min: 0,
          decimals: 2,
          paramName: 'buyBoxCurrent',
          allowNull: true,
        }),
        buyBox30DaysAvg: parseAndValidateNumber(
          data['Buy Box 🚚: 30 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'buyBox30DaysAvg',
            allowNull: true,
          },
        ),
        buyBox90DaysAvg: parseAndValidateNumber(
          data['Buy Box 🚚: 90 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'buyBox90DaysAvg',
            allowNull: true,
          },
        ),
        buyBox180DaysAvg: parseAndValidateNumber(
          data['Buy Box 🚚: 180 days avg.'],
          {
            min: 0,
            decimals: 2,
            paramName: 'buyBox180DaysAvg',
            allowNull: true,
          },
        ),
        buyBoxLowest: parseAndValidateNumber(data['Buy Box 🚚: Lowest'], {
          min: 0,
          decimals: 2,
          paramName: 'buyBoxLowest',
          allowNull: true,
        }),
        buyBoxHighest: parseAndValidateNumber(data['Buy Box 🚚: Highest'], {
          min: 0,
          decimals: 2,
          paramName: 'buyBoxHighest',
          allowNull: true,
        }),
        buyBoxSeller: data['Buy Box Seller'],
        buyBoxIsFBA: data['Buy Box: Is FBA'] === 'true',
        buyBoxUnqualified: data['Buy Box: Unqualified'] === 'true',
        urlAmazon: data['URL: Amazon'],
        urlKeepa: data['URL: Keepa'],
        categoriesSub: data['Catégories: Sub'],
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
        isHazmat: data['Est Hazmat'] === 'true',
      };

      results.push(mappedData);
    } catch (error) {
      errors.push({ error: error.message, row: data });
      if (createLog) {
        logger(
          `Error processing row: ${error.message}`,
          logContext,
          flushBuffer,
        );
      }
    }
  }

  try {
    if (results.length > 0) {
      const insertResult = await db.KeepaData.bulkCreate(results, {
        ignoreDuplicates: true,
      });
      logger(
        `${insertResult.length} records inserted.`,
        logContext,
        flushBuffer,
      );
    }
    logger('Keepa data processed successfully.', logContext, flushBuffer);
  } catch (error) {
    logger(
      'Error during bulk insert: ' + error.message,
      logContext,
      flushBuffer,
    );
  }

  return {
    message: 'Keepa data processed successfully.',
    processed: results.length,
    duplicates: duplicates.size,
    missingProductCategories: missingProductCategories.length,
    errors: errors.length,
  };
};

// Use the function
const filePath = path.resolve(
  __dirname,
  '../../../uploads/file-1713591845018.csv',
);
processKeepaDataFile(filePath, true, 'keepaProcessingService', true).then(
  result => console.log(result),
);
