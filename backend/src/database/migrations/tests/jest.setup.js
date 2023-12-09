jest.setTimeout(30000); // Set a higher than default timeout, as database operations can be slow
const db = require('../../../api/models/index.js');

/**
 * Initialize the database
 * @async
 * @function initializeDatabase
 * @return {Promise<void>} Promise object that represents the completion of the operation
 */
async function initializeDatabase() {
  await db.synchronizeAndMigrate();
  // console.log('Database synchronized and migrated');
}

/**
 * Close the database connection
 * @async
 * @function closeDatabase
 * @return {Promise<void>} Promise object that represents the completion of the operation
 */
async function closeDatabase() {
  await db.sequelize.close();
  // console.log('Database connection closed');
}

module.exports = {
  db,
  initializeDatabase,
  closeDatabase,
};
