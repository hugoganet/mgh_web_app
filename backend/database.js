const {Sequelize} = require('sequelize'); // Sequelize module
const config = require('./config/config.json'); // Config file

// Configure and create a Sequelize instance
console.log("Configuring Sequelize instance...");

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password,{
    dialect: 'postgres',
    define: {
        underscored: true,
    }
});

module.exports = sequelize;