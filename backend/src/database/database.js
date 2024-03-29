const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

// Determine the environment and choose the appropriate database configuration
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

console.log(`Configuring Sequelize for ${env} environment...`);

// Check if the application is running on Heroku
const isProduction = env === 'production';

// Create a Sequelize instance
const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // This will help in not rejecting the connection
        },
      },
      logging: false,
    })
  : new Sequelize(
      // local database configuration
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect || 'postgres',
        define: {
          underscored: true,
        },
        logging: false,
      },
    );

module.exports = sequelize;
