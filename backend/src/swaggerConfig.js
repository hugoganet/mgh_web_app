const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API for MGHWebApp',
    version: '1.0.0',
    description:
      'API for MGHWebApp. This API is used to interact with the MGHWebApp frontend.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local server',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/api/controllers/*.js', './src/api/routes/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
