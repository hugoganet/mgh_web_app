// Initialize the express app and test the connection to the SQL server
const express = require('express');
const app = express();
const db = require('./database/models'); // Import the database object

/**
 * Test the connection to the SQL server
 */
async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection with postgreSQL server established successfully.');
  } catch (error) {
    console.error('Unable to connect to postgreSQL server:', error);
  }
}
testConnection();

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

module.exports = app;
