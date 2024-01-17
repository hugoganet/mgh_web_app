require('dotenv').config({ path: 'backend/.env' });
const app = require('../app');
const PORT = process.env.PORT || 3001;
const initializeDatabase = require('../database/initialize');

const isTest = process.env.NODE_ENV === 'test';

(async () => {
  if (isTest) {
    console.log('Initializing database...');
    await initializeDatabase({ forceSync: true });
  } else {
    await initializeDatabase();
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
