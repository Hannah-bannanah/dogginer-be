const path = require('path');

const responseContentSchema = {
  'application/json': {
    schema: {
      type: Object,
      properties: {
        error: { type: String }
      }
    }
  }
};

const SWAGGERSPEC = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dogginer API',
      version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      responses: {
        InvalidEntryError: {
          description: 'Informacion invalida',
          content: responseContentSchema
        },
        DuplicateEntryError: {
          description: 'Entrada duplicada',
          content: responseContentSchema
        },
        ElementNotFoundError: {
          content: responseContentSchema
        },
        UnauthorizedError: {
          description: 'El token de acceso no es valido o no existe'
        }
      }
    }
  },
  apis: [`${path.join(__dirname, '../routes/*.js')}`]
};

module.exports = { SWAGGERSPEC };
