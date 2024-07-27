const express = require('express');
const app = express.Router();

const GetToken = require('./helpers/GetToken'); 
const ConsultaCreditos = require('./helpers/ConsultaCreditos');
const ConsultaBeneficios = require('./helpers/ConsultaBeneficios');
const VerificarStatus = require('./helpers/VerificarStatus');
const SolicitaBeneficio = require('./helpers/SolicitaBeneficios');

// Rotas
app.get('/promosys/gera-token', GetToken, VerificarStatus, (req, res) => {
  res.json({ token: req.token });
});

app.get('/promosys/consulta-creditos', GetToken, ConsultaCreditos);
app.get('/promosys/consulta-beneficios/:cpf', GetToken, ConsultaBeneficios);
app.get('/promosys/solicita-beneficio/:beneficio', GetToken, SolicitaBeneficio);

module.exports = app;