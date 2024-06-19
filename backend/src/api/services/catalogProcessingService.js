const fs = require('fs');
const csv = require('csv-parser');
const db = require('../../database/models/index');
const {
  parseAndValidateNumber,
} = require('../../utils/parseAndValidateNumber');

const processCatalogFile = async filePath => {
  const results = [];
  const errors = [];
  const eansToCheck = new Set();

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', data => {
        try {
          const ean = data.ean;
          if (eansToCheck.has(ean)) {
            errors.push({ error: 'Duplicate EAN in uploaded file', ean });
            return;
          }
          eansToCheck.add(ean);

          const supplierPartNumber = data.supplierPartNumber;
          const productName = data.productName;
          const productPriceExc = parseAndValidateNumber(data.productPriceExc, {
            min: 0,
            max: Infinity,
            paramName: 'product price excluding VAT',
            decimals: 2,
          });
          const productVatRate = parseAndValidateNumber(data.productVatRate, {
            min: 0,
            max: 1,
            paramName: 'product VAT rate',
            decimals: 4,
          });
          const currencyCode = data.currencyCode;

          if (!/^[0-9]{13}$/.test(ean)) {
            throw new Error('EAN must be 13 digits long.');
          }

          results.push({
            ean,
            supplierPartNumber,
            productName,
            productPriceExc,
            productVatRate,
            currencyCode,
          });
        } catch (error) {
          errors.push({ error: error.message, row: data });
        }
      })
      .on('end', async () => {
        try {
          // Check for existing EANs in the database to prevent unique constraint errors
          const existingEans = await db.FormattedCatalog.findAll({
            where: {
              ean: Array.from(eansToCheck),
            },
            attributes: ['ean'],
            raw: true,
          });
          const existingEanSet = new Set(existingEans.map(e => e.ean));

          const newEntries = results.filter(
            entry => !existingEanSet.has(entry.ean),
          );
          const duplicateEntries = results.filter(entry =>
            existingEanSet.has(entry.ean),
          );
          duplicateEntries.forEach(entry =>
            errors.push({
              error: 'EAN already exists in database',
              ean: entry.ean,
            }),
          );

          // Proceed with batch insertion of new entries
          const insertResult = await db.FormattedCatalog.bulkCreate(
            newEntries,
            {
              validate: true,
            },
          );

          fs.unlinkSync(filePath); // Optionally remove file after processing
          resolve({
            message: 'Catalog processed successfully.',
            results: insertResult,
            errors,
          });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', error => reject(error));
  });
};

module.exports = { processCatalogFile };
