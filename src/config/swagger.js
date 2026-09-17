const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flutter Backend API Documentation',
      version: '1.0.0',
      description: 'Complete Authentication & User Management APIs with JWT',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
      {
        url: 'https://flutter-node-backend-7saf.onrender.com',
        description: 'Production Live Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // જે ફાઈલોમાં API કોમેન્ટ્સ લખેલી હોય તેનો પાથ
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;