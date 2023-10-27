// Required modules
const fs = require('fs');                       // File System module to read files
const path = require('path');                   // Path module to handle file paths
const basename = path.basename(__filename); // Get the base name of the current file
const { Sequelize } = require('sequelize'); // Sequelize module
const sequelize = require('../database'); // Sequelize instance

// Database object to hold our models
const db = {};

console.log("Sequelize instance configured. Loading models...");

// Read all files in the current directory, filter out non-model files, and import each model
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Exclude files starting with '.'
      file !== basename &&       // Exclude the current file (index.js)
      file.slice(-3) === '.js' && // Include only .js files
      file.indexOf('.test.js') === -1 && // Exclude test files
      file !== 'modelsAssociations.js' // Exclude the modelsAssociations.js file
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
   	//const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

	// Add the model to the db object
    db[model.name] = model;
  });

// Load and apply model associations
const setupAssociations = require('./modelsAssociations.js');
setupAssociations(sequelize);

// Synchronize all models with the database
 (async () => {
 	try {
	  // Synchronize tables in the order of dependency
	  await db.Country.sync({ force: true });
	  await db.Brand.sync({ force: true });
	  //await db.Ean.sync({ force: true });
	  console.log('All tables created in order');
	} catch (error) {
	  console.error('Error creating tables:', error);
	}
  })();  

// Assign the Sequelize instance and class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object containing all models
module.exports = db;
