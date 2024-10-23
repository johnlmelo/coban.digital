const express = require('express');
const app = express.Router();

const GeraToken = require('./helpers/GeraToken'); 
const VerificarStatus = require('./helpers/VerificarStatus');
const consultarLimite = require('./helpers/consultarLimite');
const consultaConvenio = require('./helpers/consultaConvenio');
const tratarContasPorMatricula = require('./helpers/tratarContasPorMatricula');

// Criar um card
app.get('/master/gera-token', GeraToken, VerificarStatus);

app.get('/master/limite/consultar/:cpf/:convenioId', GeraToken, consultarLimite);

app.get('/master/convenio/consultar/:cpf', GeraToken, consultaConvenio);

app.post('/master/contas/tratar-dados', GeraToken, tratarContasPorMatricula);

module.exports = app;
