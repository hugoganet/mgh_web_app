const fs = require('fs');
const csv = require('csv-parser');
const db = require('../database/models');
const { parseAndValidateNumber } = require('../utils/numberUtils');

const processCatalogFile = async filePath => {
  const results = [];
  const errors = []; // Array to collect rows that fail to import

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', data => {
        try {
          const ean = data.ean;
          const supplierPartNumber = data.supplier_part_number;
          const productName = data.product_name;
          const productPriceExc = parseAndValidateNumber(
            data.product_price_exc,
            {
              min: 0,
              max: Infinity,
              paramName: 'product price excluding VAT',
              decimals: 2,
            },
          );
          const productVatRate = parseAndValidateNumber(data.product_vat_rate, {
            min: 0,
            max: 100, // Assuming VAT rate cannot be more than 100%
            paramName: 'product VAT rate',
            decimals: 2,
          });
          const currencyCode = data.currency_code;

          // Validate EAN format
          if (!/^[0-9]{13}$/.test(ean)) {
            throw new Error('EAN must be 13 digits long.');
          }

          results.push({
            ean,
            supplier_part_number: supplierPartNumber,
            product_name: productName,
            product_price_exc: productPriceExc,
            product_vat_rate: productVatRate,
            currency_code: currencyCode,
          });
        } catch (error) {
          // Collect error details and the problematic row
          errors.push({ error: error.message, row: data });
        }
      })
      .on('end', async () => {
        try {
          for (const item of results) {
            await db.FormattedCatalog.create(item);
          }
          fs.unlinkSync(filePath); // Optionally remove file after processing
          resolve({ message: 'Catalog processed successfully.', errors });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', error => reject(error));
  });
};

module.exports = { processCatalogFile };
