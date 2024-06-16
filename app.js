// Importa o módulo express
const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

// Rota raiz que envia uma resposta de texto quando acessada
app.get('/', (req, res) => {
  res.send('Olá! Bem-vindo a API CJ2 Express');
});

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
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});