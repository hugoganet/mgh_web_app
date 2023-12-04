const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

// Configure and create a Sequelize instance
console.log('Configuring Sequelize instance...');

// let dbConfig;

// if (process.env.NODE_ENV === 'test') {

// }
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    dialect: 'postgres',
    define: {
      underscored: true,
    },
    logging: false,
  },
);

module.exports = sequelize;
