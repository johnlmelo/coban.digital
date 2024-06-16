const express = require('express');
const app = express.Router();

const GeraToken = require('./helpers/GeraToken'); 
const ConsultaFGTS = require('./helpers/fgts/ConsultaFGTS'); 
const VerificarStatus = require('./helpers/VerificarStatus');

// Criar um card
app.get('/facta/gera-token', GeraToken, VerificarStatus);
app.get('/facta/consulta-fgts/:cpf', GeraToken, ConsultaFGTS);

module.exports = app;