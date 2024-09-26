const express = require('express');
const app = express.Router();

const GeraToken = require('./helpers/GeraToken'); 
const VerificarStatus = require('./helpers/VerificarStatus');

// Criar um card
app.get('/master/gera-token', GeraToken, VerificarStatus);

module.exports = app;
