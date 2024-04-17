const fs = require('fs');
const csv = require('csv-parser');
const db = require('../../database/models/index');

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error(error);
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
};

// Function to handle the CSV file upload and process it into the database
exports.uploadCsvFile = async (req, res) => {
  if (!req.file) {
    return sendErrorResponse(res, new Error('No file uploaded'), 400);
  }

  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', async () => {
        try {
          await processKeepaData(results);
          fs.unlinkSync(req.file.path); // Remove the file after processing
          res.status(200).send({ message: 'Data processed successfully' });
        } catch (processError) {
          sendErrorResponse(res, processError);
        }
      });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Function to map CSV rows to the KeepaData model and save to the database
const processKeepaData = async dataRows => {
  for (const row of dataRows) {
    const mappedData = mapCsvRowToKeepaData(row);
    await db.KeepaData.create(mappedData);
  }
};

// Mapping function from CSV row to KeepaData model
const mapCsvRowToKeepaData = row => {
  return {
    countryCode: row['Locale'],
    urlImage: row['Image'],
    productName: row['Titre'],
    salesRanking30DaysAvg: row['Classement des ventes: 30 days avg.'],
    salesRanking90DaysAvg: row['Classement des ventes: 90 days avg.'],
    salesRanking180DaysAvg: row['Classement des ventes: 180 days avg.'],
    productCategoryId: row['Classement des ventes: Reference'],
    reviewsRating: row['Revues: Évaluation'],
    reviewsCount: row['Reviews: Nombre de revu est'],
    amazonCurrent: row['Amazon: Courant'],
    amazon30DaysAvg: row['Amazon: 30 days avg.'],
    amazon90DaysAvg: row['Amazon: 90 days avg.'],
    amazon180DaysAvg: row['Amazon: 180 days avg.'],
    amazonLowest: row['Amazon: Lowest'],
    amazonHighest: row['Amazon: Highest'],
    amazon90DaysOOS: row['Amazon: 90 days OOS'],
    newCurrent: row['Nouveau: Courant'],
    new30DaysAvg: row['Nouveau: 30 days avg.'],
    new90DaysAvg: row['Nouveau: 90 days avg.'],
    new180DaysAvg: row['Nouveau: 180 days avg.'],
    newThirdPartyFBACurrent: row['Nouveau, Tierce Partie FBA: Courant'],
    newThirdPartyFBA30DaysAvg: row['Nouveau, Tierce Partie FBA: 30 days avg.'],
    newThirdPartyFBA90DaysAvg: row['Nouveau, Tierce Partie FBA: 90 days avg.'],
    newThirdPartyFBA180DaysAvg:
      row['Nouveau, Tierce Partie FBA: 180 days avg.'],
    newThirdPartyFBALowest: row['Nouveau, Tierce Partie FBA: Lowest'],
    fbaPickPackFee: row['FBA Pick&Pack Fee'],
    newThirdPartyFBMCurrent: row['Nouveau, Tierce Partie FBM 🚚: Courant'],
    newThirdPartyFBM30DaysAvg:
      row['Nouveau, Tierce Partie FBM 🚚: 30 days avg.'],
    newThirdPartyFBM90DaysAvg:
      row['Nouveau, Tierce Partie FBM 🚚: 90 days avg.'],
    newThirdPartyFBM180DaysAvg:
      row['Nouveau, Tierce Partie FBM 🚚: 180 days avg.'],
    newOffersCurrentCount: row["Nombre d'offre Neuf: Courant"],
    newOffers90DaysAvgCount: row["Nombre d'offre Neuf: 90 days avg."],
    countRetrievedLiveOffersNewFBA:
      row['Count of retrieved live offers: New, FBA'],
    countRetrievedLiveOffersNewFBM:
      row['Count of retrieved live offers: New, FBM'],
    buyBoxCurrent: row['Buy Box 🚚: Courant'],
    buyBox30DaysAvg: row['Buy Box 🚚: 30 days avg.'],
    buyBox90DaysAvg: row['Buy Box 🚚: 90 days avg.'],
    buyBox180DaysAvg: row['Buy Box 🚚: 180 days avg.'],
    buyBoxLowest: row['Buy Box 🚚: Lowest'],
    buyBoxHighest: row['Buy Box 🚚: Highest'],
    buyBoxSeller: row['Buy Box Seller'],
    buyBoxIsFBA: row['Buy Box: Is FBA'],
    buyBoxUnqualified: row['Buy Box: Unqualified'],
    urlAmazon: row['URL: Amazon'],
    urlKeepa: row['URL: Keepa'],
    categoriesRoot: row['Catégories: Root'],
    categoriesSub: row['Catégories: Sub'],
    asin: row['ASIN'],
    ean: row['Product Codes: EAN'],
    brand: row['Brand'],
    numberOfItems: row['Number of Items'],
    packageLengthCm: row['Package: Length (cm)'],
    packageWidthCm: row['Package: Width (cm)'],
    packageHeightCm: row['Package: Height (cm)'],
    packageWeightG: row['Package: Weight (g)'],
    isHazmat: row['Est Hazmat'],
  };
};
