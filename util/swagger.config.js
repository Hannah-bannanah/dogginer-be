const path = require('path');

const SWAGGERSPEC = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dogginer API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: [`${path.join(__dirname, '../routes/*.js')}`],
};

module.exports = { SWAGGERSPEC };
