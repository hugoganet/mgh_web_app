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

// async function testConnection() {
//     console.log("Testing connection to SQL server...")
//     try {
//         await db.sequelize.authenticate();
//         console.log('Connection with postgreSQL server established successfully.');
//       } catch (error) {
//         console.error('Unable to connect to postgreSQL server:', error);
//       }
//   }
//   testConnection();

module.exports = sequelize;