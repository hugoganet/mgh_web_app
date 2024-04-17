const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const sequelize = require('../../database/database.js'); // Sequelize instance
const setupAssociations = require('../../database/modelsAssociations');
const runSeeding = require('../../database/seed');

const db = {}; // Database object to hold our models

// Read all files in the current directory, filter out non-model files, and import each model
fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && // Exclude hidden files
      file !== 'index.js' && // Exclude the current file (index.js)
      file.slice(-3) === '.js', // Include only JavaScript files
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

setupAssociations(db);
runSeeding(db);

console.log('Sequelize models loaded and associations set up.');
// Assign the Sequelize instance and class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
