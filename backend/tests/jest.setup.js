jest.setTimeout(30000); // Higher timeout for database operations
const db = require('../src/database/models/index');

/**
 * Initialize the database for testing.
 * @async
 * @function initializeTestDatabase
 * @return {Promise<void>} Promise representing the completion of initialization
 */
async function initializeTestDatabase() {
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
      'AfnInventoryDailyUpdate',
      'SellingPriceHistory',
      'FbaSaleProcessed',
      'DailyAverageExchangeRate',
      'AfnShipments',
      'AfnRemovalOrders',
      'AfnRemovalOrdersDetails',
      'AfnRemovalShipmentsDetails',
      'EanInAfnRemovalOrders',
      'EanInAfnShipments',
    ];

    // Synchronize each model in order
    for (const modelName of modelOrder) {
      if (db[modelName] && db[modelName].sync) {
        await db[modelName].sync({ force: true });
      }
    }

    await runSeeding(db);
    await createSqlViews(db);
    console.log('Test database initialization complete.');
  } catch (error) {
    console.error('Error initializing test database:', error);
  }
}

/**
 * Close the database connection.
 * @async
 * @function closeDatabase
 * @return {Promise<void>} Promise representing the completion of closing the connection
 */
async function closeDatabase() {
  await db.sequelize.close();
}

module.exports = {
  db,
  initializeTestDatabase,
  closeDatabase,
};
