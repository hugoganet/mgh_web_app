const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const db = require('../database/models');

// Test the connection to the SQL server
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
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
