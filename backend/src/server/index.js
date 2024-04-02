require('dotenv').config({ path: 'backend/.env' });
const app = require('../app');
const PORT = process.env.PORT || 3001; // Use Heroku's PORT or 3001 if local

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
