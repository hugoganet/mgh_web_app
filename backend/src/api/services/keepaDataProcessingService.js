const fs = require('fs');
const csv = require('csv-parser');
const db = require('../../database/models/index');
const {
  parseAndValidateNumber,
} = require('../../utils/parseAndValidateNumber');
const getProductCategoryId = require('./getProductCategoryId');

const processKeepaDataFile = async filePath => {
  const results = [];
  const errors = [];
  const duplicates = [];
  const existingCombos = new Set(); // To track unique asin and countryCode combinations

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async data => {
        try {
          const countryCode = data.Locale.toUpperCase();
          const asin = data.ASIN;
          const comboKey = `${asin}-${countryCode}`;

          if (existingCombos.has(comboKey)) {
            duplicates.push({
              asin,
              countryCode,
              reason:
                'Duplicate ASIN and Country Code combination in the batch',
            });
            return;
          }
          existingCombos.add(comboKey);

          const productCategoryId = await getProductCategoryId(
            data['Catégories: Root'],
            countryCode,
          );

          if (!productCategoryId) {
            errors.push({
              error: 'No valid product category ID found',
              asin,
              productCategory: data['Catégories: Root'],
            });
            return;
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
              { min: 0, paramName: 'salesRanking30DaysAvg' },
            ),
            salesRanking90DaysAvg: parseAndValidateNumber(
              data['Classement des ventes: 90 days avg.'],
              { min: 0, paramName: 'salesRanking90DaysAvg' },
            ),
            salesRanking180DaysAvg: parseAndValidateNumber(
              data['Classement des ventes: 180 days avg.'],
              { min: 0, paramName: 'salesRanking180DaysAvg' },
            ),
            productCategoryId,
            reviewsRating: parseAndValidateNumber(data['Revues: Évaluation'], {
              min: 0,
              max: 5,
              decimals: 2,
              paramName: 'reviewsRating',
            }),
            reviewsCount: parseAndValidateNumber(
              data['Reviews: Nombre de revu est'],
              { min: 0, decimals: 0, paramName: 'reviewsCount' },
            ),
            amazonCurrent: parseAndValidateNumber(data['Amazon: Courant'], {
              min: 0,
              decimals: 2,
              paramName: 'amazonCurrent',
            }),
            amazon30DaysAvg: parseAndValidateNumber(
              data['Amazon: 30 days avg.'],
              { min: 0, decimals: 2, paramName: 'amazon30DaysAvg' },
            ),
            amazon90DaysAvg: parseAndValidateNumber(
              data['Amazon: 90 days avg.'],
              { min: 0, decimals: 2, paramName: 'amazon90DaysAvg' },
            ),
            amazon180DaysAvg: parseAndValidateNumber(
              data['Amazon: 180 days avg.'],
              { min: 0, decimals: 2, paramName: 'amazon180DaysAvg' },
            ),
            amazonLowest: parseAndValidateNumber(data['Amazon: Lowest'], {
              min: 0,
              decimals: 2,
              paramName: 'amazonLowest',
            }),
            amazonHighest: parseAndValidateNumber(data['Amazon: Highest'], {
              min: 0,
              decimals: 2,
              paramName: 'amazonHighest',
            }),
            amazon90DaysOOS: parseInt(data['Amazon: 90 days OOS']),
            newCurrent: parseAndValidateNumber(data['Nouveau: Courant'], {
              min: 0,
              decimals: 2,
              paramName: 'newCurrent',
            }),
            new30DaysAvg: parseAndValidateNumber(
              data['Nouveau: 30 days avg.'],
              { min: 0, decimals: 2, paramName: 'new30DaysAvg' },
            ),
            new90DaysAvg: parseAndValidateNumber(
              data['Nouveau: 90 days avg.'],
              { min: 0, decimals: 2, paramName: 'new90DaysAvg' },
            ),
            new180DaysAvg: parseAndValidateNumber(
              data['Nouveau: 180 days avg.'],
              { min: 0, decimals: 2, paramName: 'new180DaysAvg' },
            ),
            newThirdPartyFBACurrent: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: Courant'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBACurrent' },
            ),
            newThirdPartyFBA30DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: 30 days avg.'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBA30DaysAvg' },
            ),
            newThirdPartyFBA90DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: 90 days avg.'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBA90DaysAvg' },
            ),
            newThirdPartyFBA180DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: 180 days avg.'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBA180DaysAvg' },
            ),
            newThirdPartyFBALowest: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: Lowest'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBALowest' },
            ),
            fbaPickPackFee: parseAndValidateNumber(data['FBA Pick&Pack Fee'], {
              min: 0,
              decimals: 2,
              paramName: 'fbaPickPackFee',
            }),
            newThirdPartyFBMCurrent: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBM 🚚: Courant'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBMCurrent' },
            ),
            newThirdPartyFBM30DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBM 🚚: 30 days avg.'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBM30DaysAvg' },
            ),
            newThirdPartyFBM90DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBM 🚚: 90 days avg.'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBM90DaysAvg' },
            ),
            newThirdPartyFBM180DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBM 🚚: 180 days avg.'],
              { min: 0, decimals: 2, paramName: 'newThirdPartyFBM180DaysAvg' },
            ),
            newOffersCurrentCount: parseInt(
              data["Nombre d'offre Neuf: Courant"],
            ),
            newOffers90DaysAvgCount: parseInt(
              data["Nombre d'offre Neuf: 90 days avg."],
            ),
            countRetrievedLiveOffersNewFBA: parseInt(
              data['Count of retrieved live offers: New, FBA'],
            ),
            countRetrievedLiveOffersNewFBM: parseInt(
              data['Count of retrieved live offers: New, FBM'],
            ),
            buyBoxCurrent: parseAndValidateNumber(data['Buy Box 🚚: Courant'], {
              min: 0,
              decimals: 2,
              paramName: 'buyBoxCurrent',
            }),
            buyBox30DaysAvg: parseAndValidateNumber(
              data['Buy Box 🚚: 30 days avg.'],
              { min: 0, decimals: 2, paramName: 'buyBox30DaysAvg' },
            ),
            buyBox90DaysAvg: parseAndValidateNumber(
              data['Buy Box 🚚: 90 days avg.'],
              { min: 0, decimals: 2, paramName: 'buyBox90DaysAvg' },
            ),
            buyBox180DaysAvg: parseAndValidateNumber(
              data['Buy Box 🚚: 180 days avg.'],
              { min: 0, decimals: 2, paramName: 'buyBox180DaysAvg' },
            ),
            buyBoxLowest: parseAndValidateNumber(data['Buy Box 🚚: Lowest'], {
              min: 0,
              decimals: 2,
              paramName: 'buyBoxLowest',
            }),
            buyBoxHighest: parseAndValidateNumber(data['Buy Box 🚚: Highest'], {
              min: 0,
              decimals: 2,
              paramName: 'buyBoxHighest',
            }),
            buyBoxSeller: data['Buy Box Seller'],
            buyBoxIsFBA: data['Buy Box: Is FBA'] === 'true',
            buyBoxUnqualified: data['Buy Box: Unqualified'] === 'true',
            urlAmazon: data['URL: Amazon'],
            urlKeepa: data['URL: Keepa'],
            categoriesSub: data['Catégories: Sub'],
            numberOfItems: parseInt(data['Number of Items']),
            packageLengthCm: parseInt(data['Package: Length (cm)']),
            packageWidthCm: parseInt(data['Package: Width (cm)']),
            packageHeightCm: parseInt(data['Package: Height (cm)']),
            packageWeightG: parseInt(data['Package: Weight (g)']),
            isHazmat: data['Est Hazmat'] === 'true',
          };

          results.push(mappedData);
        } catch (error) {
          errors.push({ error: error.message, row: data });
        }
      })
      .on('end', async () => {
        if (results.length > 0) {
          try {
            await db.KeepaData.bulkCreate(results, { ignoreDuplicates: true });
          } catch (bulkError) {
            reject(bulkError);
          }
        }

        fs.unlinkSync(filePath); // Optionally remove file after processing
        resolve({
          message: 'Keepa data processed successfully.',
          processed: results.length - duplicates.length,
          successful: results.length,
          duplicates: duplicates.length,
          errors: errors,
        });
      })
      .on('error', error => reject(error));
  });
};

module.exports = { processKeepaDataFile };
