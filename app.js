// Importa o módulo express
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const sequelize = require('./config/database');

require('dotenv').config();
const bodyParser = require('body-parser');

// Configura o body-parser para analisar JSON
app.use(bodyParser.json());

// Configura o body-parser para analisar dados codificados em URL
app.use(bodyParser.urlencoded({ extended: true }));

// Configura o motor de visualização como EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const setupRoutes = require('./api');
setupRoutes(app);

// Middleware para análise do corpo da solicitação em JSON
app.use(express.json({ limit: '50mb' }));

// Middleware para análise do corpo da solicitação URL-encoded
app.use(express.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 100000
}));

// O servidor começa a ouvir a porta especificada
app.listen(3000, async () => {
  try {
    await sequelize.sync({ force: false }); // Sincroniza e cria as tabelas
    console.log('Servidor rodando na porta 3000');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
});