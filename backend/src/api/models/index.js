// Required modules
const fs = require('fs'); // File System module to read files
const path = require('path'); // Path module to handle file paths
const { Sequelize } = require('sequelize'); // Sequelize module
const sequelize = require('../../database/database.js'); // Sequelize instance
const runSeeding = require('../../database/seeders/migrateData'); // Function to run migrations

// Database object to hold our models
const db = {};

console.log('Sequelize instance configured. Loading models...');

// Read all files in the current directory, filter out non-model files, and import each model
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file !== 'index.js' && // Exclude the current file (index.js)
      file !== 'modelsAssociations.js' && // Exclude the modelsAssociations.js file
      file !== 'modelToFileMap.js' // Exclude the modelsAssociations.js file
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );

    // Add the model to the db object
    db[model.name] = model;
  });

// Load and apply model associations
const setupAssociations = require('../../database/modelsAssociations');

setupAssociations(sequelize);

/**
 * Synchronize all models with the database and run migrations
 * @async
 * @function synchronizeAndMigrate
 * @return {Promise<void>} Promise object that represents the completion of the operation
 * @throws {Error} Error creating tables
 */
async function synchronizeAndMigrate() {
  try {
    console.log('Synchronizing all models with the database...');
    // Synchronize tables in the order of dependency
    await db.Country.sync({ force: true });
    await db.Brand.sync({ force: true });
    await db.VatCategory.sync({ force: true });
    await db.ProductCategory.sync({ force: true });
    await db.VatRatePerCountry.sync({ force: true });
    await db.ProductCategoryRank.sync({ force: true });
    await db.ProductTaxCategory.sync({ force: true });
    await db.Ean.sync({ force: true });
    await db.Asin.sync({ force: true });
    await db.Sku.sync({ force: true });
    await db.AsinSku.sync({ force: true });
    await db.EanInAsin.sync({ force: true });
    await db.Warehouse.sync({ force: true });
    await db.AmazonReferralFee.sync({ force: true });
    await db.ProductAndAmzReferralFeeCategory.sync({ force: true });
    await db.PriceGridFbaFee.sync({ force: true });
    await db.PricingRule.sync({ force: true });
    await db.Supplier.sync({ force: true });
    await db.Donation.sync({ force: true });
    await db.SupplierOrder.sync({ force: true });
    await db.MinimumSellingPrice.sync({ force: true });
    await db.FbaFee.sync({ force: true });
    await db.Catalog.sync({ force: true });
    await db.SupplierBrandCatalog.sync({ force: true });
    await db.EanInSupplierOrder.sync({ force: true });
    await db.EanInDonation.sync({ force: true });
    await db.WarehouseStock.sync({ force: true });
    await db.AfnInventoryDailyUpdate.sync({ force: true });

    console.log('All tables created in order');

    // Run migrations
    await runSeeding(db);
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// synchronizeAndMigrate();

// Assign the Sequelize instance and class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.synchronizeAndMigrate = synchronizeAndMigrate;

// Export the db object containing all models
module.exports = db;
