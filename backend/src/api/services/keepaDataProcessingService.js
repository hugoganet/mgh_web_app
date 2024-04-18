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

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async data => {
        try {
          const productCategoryId = await getProductCategoryId(
            data['Catégories: Root'],
            data.Locale,
          );
          if (!productCategoryId) {
            errors.push({
              error:
                'No valid product category ID found for the provided category reference.',
              row: data,
              reference: data['Catégories: Root'],
            });
            return; // Skip further processing for this row
          }

          const asin = data.ASIN;
          if (existingAsins.has(asin)) {
            duplicates.push({
              asin,
              error: 'Duplicate ASIN in the batch',
              row: data,
            });
            return; // Skip this duplicate entry
          }
          existingAsins.add(asin);
          console.log(data);

          const mappedData = {
            countryCode: data.Locale,
            urlImage: data.Image,
            asin,
            ean: data['Product Codes: EAN'],
            brand: data['Brand'],
            productName: data.Titre,
            salesRanking30DaysAvg: parseAndValidateNumber(
              data['Classement des ventes: 30 days avg.'],
              { min: 0 },
            ),
            salesRanking90DaysAvg: parseAndValidateNumber(
              data['Classement des ventes: 90 days avg.'],
              { min: 0 },
            ),
            salesRanking180DaysAvg: parseAndValidateNumber(
              data['Classement des ventes: 180 days avg.'],
              { min: 0 },
            ),
            productCategoryId,
            reviewsRating: parseAndValidateNumber(data['Revues: Évaluation'], {
              min: 0,
              max: 5,
              decimals: 2,
            }),
            reviewsCount: parseAndValidateNumber(
              data['Reviews: Nombre de revu est'],
              { min: 0 },
            ),
            amazonCurrent: parseAndValidateNumber(data['Amazon: Courant'], {
              min: 0,
              decimals: 2,
            }),
            amazon30DaysAvg: parseAndValidateNumber(
              data['Amazon: 30 days avg.'],
              { min: 0, decimals: 2 },
            ),
            amazon90DaysAvg: parseAndValidateNumber(
              data['Amazon: 90 days avg.'],
              { min: 0, decimals: 2 },
            ),
            amazon180DaysAvg: parseAndValidateNumber(
              data['Amazon: 180 days avg.'],
              { min: 0, decimals: 2 },
            ),
            amazonLowest: parseAndValidateNumber(data['Amazon: Lowest'], {
              min: 0,
              decimals: 2,
            }),
            amazonHighest: parseAndValidateNumber(data['Amazon: Highest'], {
              min: 0,
              decimals: 2,
            }),
            amazon90DaysOOS: parseInt(data['Amazon: 90 days OOS']),
            newCurrent: parseAndValidateNumber(data['Nouveau: Courant'], {
              min: 0,
              decimals: 2,
            }),
            new30DaysAvg: parseAndValidateNumber(
              data['Nouveau: 30 days avg.'],
              { min: 0, decimals: 2 },
            ),
            new90DaysAvg: parseAndValidateNumber(
              data['Nouveau: 90 days avg.'],
              { min: 0, decimals: 2 },
            ),
            new180DaysAvg: parseAndValidateNumber(
              data['Nouveau: 180 days avg.'],
              { min: 0, decimals: 2 },
            ),
            newThirdPartyFBACurrent: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: Courant'],
              { min: 0, decimals: 2 },
            ),
            newThirdPartyFBA30DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: 30 days avg.'],
              { min: 0, decimals: 2 },
            ),
            newThirdPartyFBA90DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: 90 days avg.'],
              { min: 0, decimals: 2 },
            ),
            newThirdPartyFBA180DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: 180 days avg.'],
              { min: 0, decimals: 2 },
            ),
            newThirdPartyFBALowest: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBA: Lowest'],
              { min: 0, decimals: 2 },
            ),
            fbaPickPackFee: parseAndValidateNumber(data['FBA Pick&Pack Fee'], {
              min: 0,
              decimals: 2,
            }),
            newThirdPartyFBMCurrent: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBM 🚚: Courant'],
              { min: 0, decimals: 2 },
            ),
            newThirdPartyFBM30DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBM 🚚: 30 days avg.'],
              { min: 0, decimals: 2 },
            ),
            newThirdPartyFBM90DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBM 🚚: 90 days avg.'],
              { min: 0, decimals: 2 },
            ),
            newThirdPartyFBM180DaysAvg: parseAndValidateNumber(
              data['Nouveau, Tierce Partie FBM 🚚: 180 days avg.'],
              { min: 0, decimals: 2 },
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
            }),
            buyBox30DaysAvg: parseAndValidateNumber(
              data['Buy Box 🚚: 30 days avg.'],
              { min: 0, decimals: 2 },
            ),
            buyBox90DaysAvg: parseAndValidateNumber(
              data['Buy Box 🚚: 90 days avg.'],
              { min: 0, decimals: 2 },
            ),
            buyBox180DaysAvg: parseAndValidateNumber(
              data['Buy Box 🚚: 180 days avg.'],
              { min: 0, decimals: 2 },
            ),
            buyBoxLowest: parseAndValidateNumber(data['Buy Box 🚚: Lowest'], {
              min: 0,
              decimals: 2,
            }),
            buyBoxHighest: parseAndValidateNumber(data['Buy Box 🚚: Highest'], {
              min: 0,
              decimals: 2,
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
        try {
          // Batch insert while ignoring duplicates
          await db.KeepaData.bulkCreate(results, {
            ignoreDuplicates: true,
          });

          fs.unlinkSync(filePath); // Optionally remove file after processing
          resolve({
            message: 'Keepa data processed successfully.',
            results: results.length - duplicates.length,
            duplicates: duplicates.length,
            errors,
          });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', error => reject(error));
  });
};

module.exports = { processKeepaDataFile };
