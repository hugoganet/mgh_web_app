require('./api/models');
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const eansRoutes = require('./api/routes/eansRoutes');
const asinsRoutes = require('./api/routes/asinsRoutes');
const skusRoutes = require('./api/routes/skusRoutes');
const warehousesRoutes = require('./api/routes/warehousesRoutes');
const countriesRoutes = require('./api/routes/countriesRoutes');
const pricingRulesRoutes = require('./api/routes/pricingRulesRoutes');
const vatCategoriesRoutes = require('./api/routes/vatCategoriesRoutes');
const vatRatesPerCountryRoutes = require('./api/routes/vatRatesPerCountryRoutes');

app.use(express.json()); // Enable parsing JSON bodies

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', // Specify the OpenAPI/Swagger version
  info: {
    title: 'MGH API',
    version: '1.0.0',
    description: 'MGH Web App API documentation',
  },
  servers: [
    {
      url: 'http://localhost:3001', // URL of your API
    },
  ],
  // ... other Swagger configuration
};

const options = {
  swaggerDefinition,
  apis: ['src/api/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

// Routes
app.use('/eans', eansRoutes);
app.use('/asins', asinsRoutes);
app.use('/skus', skusRoutes);
app.use('/warehouses', warehousesRoutes);
app.use('/countries', countriesRoutes);
app.use('/pricingRules', pricingRulesRoutes);
app.use('/vatCategories', vatCategoriesRoutes);
app.use('/vatRatesPerCountry', vatRatesPerCountryRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

module.exports = app;
