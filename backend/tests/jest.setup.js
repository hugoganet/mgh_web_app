jest.setTimeout(30000); // Higher timeout for database operations

const db = require('../src/database/models/index');
const initializeDatabase = require('../src/database/initializeDatabase');

/**
 * Initialize the database for testing.
 * @async
 * @function initializeTestDatabase
 * @return {Promise<void>} Promise representing the completion of initialization
 */
async function initializeTestDatabase() {
  await initializeDatabase({ forceSync: true });
}

/**
 * Close the database connection.
 * @async
 * @function closeDatabase
 * @return {Promise<void>} Promise representing the completion of closing the connection
 */
async function closeDatabase() {
  await db.sequelize.close();
}

module.exports = {
  db,
  initializeTestDatabase,
  closeDatabase,
};
