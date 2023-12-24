const db = require('../api/models');
const runSeeding = require('./seed');
const createSqlViews = require('./createSqlViews');

/**
 * Initialize the database
 * @async
 * @function initializeDatabase
 */
async function initializeDatabase({ forceSync = false } = {}) {
  try {
    // Define the order of model synchronization
    const modelOrder = [
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
      'SupplierOrder',
      'MinimumSellingPrice',
      'FbaFee',
      'Catalog',
      'SupplierBrandCatalog',
      'EanInSupplierOrder',
      'EanInDonation',
      'WarehouseStock',
      // 'AfnInventoryDailyUpdate', // Commented out because I want to keep the data that has been collected so far
      'FbaSaleProcessed',
    ];

    // Synchronize each model in order
    for (const modelName of modelOrder) {
      if (db[modelName] && db[modelName].sync) {
        await db[modelName].sync({ force: forceSync });
      }
    }

    if (forceSync) {
      // Run seeding
      await runSeeding(db);

      // Recreate SQL views if necessary
      await createSqlViews(db);
    }

    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = initializeDatabase;
