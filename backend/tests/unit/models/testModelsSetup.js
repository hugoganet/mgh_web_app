const db = require('../../testIndex');

async function initializeDatabase() {
    await db.synchronizeAndMigrate();
    console.log('Database synchronized and migrated');
}

async function closeDatabase() {
    await db.sequelize.close();
    console.log('Database connection closed');
}

module.exports = {
    db,
    initializeDatabase,
    closeDatabase,
};
