const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

// Determine the environment and choose the appropriate database configuration
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

console.log(`Configuring Sequelize for ${env} environment...`);

// Create a Sequelize instance with the selected configuration
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect || 'postgres', // Default to 'postgres' if not specified
    define: {
      underscored: true,
    },
    logging: false,
  },
);

module.exports = sequelize;
