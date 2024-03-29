require('dotenv').config({ path: 'backend/.env' });
const app = require('../app');
const PORT = process.env.PORT || 3001; // Use Heroku's PORT or 3001 if local
const initializeDatabase = require('../database/initializeDatabase');

const isTest = process.env.NODE_ENV === 'test';

(async () => {
  if (isTest) {
    console.log('Initializing database...');
    await initializeDatabase({ forceSync: true });
  } else {
    await initializeDatabase({ forceSync: true }); // Typically you wouldn't force sync in non-test environments
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
