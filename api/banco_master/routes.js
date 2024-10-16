const express = require('express');
const app = express.Router();

const GeraToken = require('./helpers/GeraToken'); 
const VerificarStatus = require('./helpers/VerificarStatus');
const consultarLimite = require('./helpers/consultarLimite');

// Criar um card
app.get('/master/gera-token', GeraToken, VerificarStatus);

app.get('/master/limite/consultar/:cpf/:convenioId', GeraToken, consultarLimite);

module.exports = app;
