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
              { min: 0, paramName: 'salesRanking30DaysAvg', allowNull: true },
            ),
            salesRanking90DaysAvg: parseAndValidateNumber(
              data['Classement des ventes: 90 days avg.'],
              { min: 0, paramName: 'salesRanking90DaysAvg', allowNull: true },
            ),
            salesRanking180DaysAvg: parseAndValidateNumber(
              data['Classement des ventes: 180 days avg.'],
              { min: 0, paramName: 'salesRanking180DaysAvg', allowNull: true },
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
            amazon30DaysAvg: parseAndValidateNumber(
              data['Amazon: 30 days avg.'],
              {
                min: 0,
                decimals: 2,
                paramName: 'amazon30DaysAvg',
                allowNull: true,
              },
            ),
            amazon90DaysAvg: parseAndValidateNumber(
              data['Amazon: 90 days avg.'],
              {
                min: 0,
                decimals: 2,
                paramName: 'amazon90DaysAvg',
                allowNull: true,
              },
            ),
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
            amazon90DaysOOS: parseAndValidateNumber(
              data['Amazon: 90 days OOS'],
              {
                min: 0,
                max: 1,
                decimals: 5,
                paramName: 'amazon90DaysOOS',
                allowNull: true,
              },
            ),
            newCurrent: parseAndValidateNumber(data['Nouveau: Courant'], {
              min: 0,
              decimals: 2,
              paramName: 'newCurrent',
              allowNull: true,
            }),
            new30DaysAvg: parseAndValidateNumber(
              data['Nouveau: 30 days avg.'],
              {
                min: 0,
                decimals: 2,
                paramName: 'new30DaysAvg',
                allowNull: true,
              },
            ),
            new90DaysAvg: parseAndValidateNumber(
              data['Nouveau: 90 days avg.'],
              {
                min: 0,
                decimals: 2,
                paramName: 'new90DaysAvg',
                allowNull: true,
              },
            ),
            new180DaysAvg: parseAndValidateNumber(
              data['Nouveau: 180 days avg.'],
              {
                min: 0,
                decimals: 2,
                paramName: 'new180DaysAvg',
                allowNull: true,
              },
            ),
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
              { min: 0, paramName: 'newOffers90DaysAvgCount', allowNull: true },
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
        // // Log and check for NaN values before attempting to insert into the database
        // console.log('Data to be inserted:', results);
        // results.forEach((data, index) => {
        //   Object.keys(data).forEach(key => {
        //     if (Number.isNaN(data[key])) {
        //       console.error(
        //         `NaN found in entry ${index} at key ${key} with value ${data[key]}`,
        //       );
        //       // Optionally, you can handle the NaN case, like setting it to null if allowed
        //       // data[key] = null; // Only do this if your database schema allows null values for this field
        //     }
        //   });
        // });
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
