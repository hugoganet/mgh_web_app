// Required modules
const fs = require('fs'); // File System module to read files
const path = require('path'); // Path module to handle file paths
const { Sequelize } = require('sequelize'); // Sequelize module
const sequelize = require('../database'); // Sequelize instance
const runMigrations = require('../migrations/migrateData'); // Function to run migrations

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
    // `path.join(__dirname, file)` creates an absolute path to the model file
    const modelFilePath = path.join(__dirname, file);

    // `require(modelFilePath)` dynamically requires the model file.
    // This is akin to importing the file, but done programmatically.
    // The require function actually returns the exported function from your model file.
    const modelDefinitionFunction = require(modelFilePath);

    // `modelDefinitionFunction(sequelize, Sequelize.DataTypes)` invokes the function
    // exported from your model file, passing in the sequelize instance and DataTypes.
    // This is where your model gets defined (e.g., using sequelize.define).
    // The function is expected to return the model.
    const model = modelDefinitionFunction(sequelize, Sequelize.DataTypes);

    // Alternative to the above 4 lines of code:
    // const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

    // Add the model to the db object
    db[model.name] = model;
  });

// Load and apply model associations
const setupAssociations = require('../modelsAssociations.js');

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

    console.log('All tables created in order');

    // Run migrations
    await runMigrations(db);
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

synchronizeAndMigrate();

// Assign the Sequelize instance and class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.synchronizeAndMigrate = synchronizeAndMigrate;

// Export the db object containing all models
module.exports = db;
