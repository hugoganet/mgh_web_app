const {Sequelize} = require('sequelize'); // Sequelize module
const config = require('../database/config/config.json'); // Config file

// Configure and create a Sequelize instance
console.log("Configuring Sequelize instance...");

const sequelize = new Sequelize(config.test.database, config.test.username, config.test.password,{
    dialect: 'postgres',
    define: {
        underscored: true,
    },
    logging: false,
});

module.exports = sequelize;