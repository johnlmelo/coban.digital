const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API CJ2 Banks',
      version: '1.0.0',
      description: 'Documentação de acesso a diversas APIs bancárias. Essas APIs já são autenticadas no back.',
    },
  },
  apis: ['./api/index.js'],
  servers: [
    {
      url: 'https://banks.cj2tech.com.br', // Substitua pelo seu domínio principal
      description: 'Servidor principal'
    },
    {
      url: 'http://localhost:3000', // URL para desenvolvimento local
      description: 'Servidor de desenvolvimento'
    }
  ], // Caminho para os arquivos onde estão suas rotas
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;