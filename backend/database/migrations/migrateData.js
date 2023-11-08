// Node.js modules for file system and path manipulation
const fs = require('fs');
const path = require('path');
// csv-parser package for parsing CSV files
const csvParser = require('csv-parser');

const modelToFileMap = require('../modelToFileMap');

/**
 * Function to parse CSV file and return data as an array.
 * @param {string} filePath - Path to the CSV file.
 * @return {Promise<Array>} - Promise resolving to array of objects representing CSV data.
 */
async function parseCSV(filePath) {
  // Array to accumulate parsed data
  const results = [];

  // Wrap the streaming and parsing process in a Promise
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ',' }))
      .on('data', data => results.push(data))
      .on('end', () => resolve(results))
      .on('error', error => reject(error));
  });
}

/**
 * Function to migrate data for a specific table.
 * @param {Object} db - Database object.
 * @param {string} tableName - Name of the table to migrate data to.
 */
async function migrate(db, tableName) {
  // console.log(`Migrating data for ${tableName}...`);
  // Construct the file path for the CSV file
  const filePath = path.join(__dirname, modelToFileMap[tableName]);
  // console.log(`Migrating data for ${tableName}, file path: ${filePath}`);

  try {
    // Parse the CSV file
    let data = await parseCSV(filePath);

    // Preprocess data: Convert empty strings to actual null values
    data = data.map(row => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          value.trim() === '' || value.trim() === 'null' ? null : value.trim(),
        ]),
      );
    });

    // Check if the table model exists in the database object
    if (!db[tableName]) {
      throw new Error(`Model for ${tableName} is not defined in db object.`);
    }

    // Bulk insert parsed data into the corresponding table
    await db[tableName].bulkCreate(data);
    // console.log(`Migration for ${tableName} completed.`);
  } catch (error) {
    console.error(`Error migrating data for ${tableName}:`, error);
    throw error; // Propagate the error to be handled by the caller
  }
}

/**
 * Function to run migrations for all tables in the order of dependency.
 * @param {Object} db - Database object get from models/index.js.
 */
async function runMigrations(db) {
  try {
    // Array of table names in the order they need to be migrated
    const tables = [
      'Country',
      'Brand',
      'VatCategory',
      'ProductCategory',
      'VatRatePerCountry',
      'ProductCategoryRank',
      'ProductTaxCategory',
      'Ean',
      'Asin',
      'Sku',
      'AsinSku',
      'EanInAsin',
      'Warehouse',
      'AmazonReferralFee',
      'ProductAndAmzReferralFeeCategory',
      'PriceGridFbaFee',
      'PricingRule',
      'Supplier',
      'Donation',
    ];

    // Sequentially migrate each table
    for (const table of tables) {
      await migrate(db, table);
    }
    // console.log('All migrations completed.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

module.exports = runMigrations;
