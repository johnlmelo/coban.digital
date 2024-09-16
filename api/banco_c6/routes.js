const express = require('express');
const app = express.Router();

const GeraToken = require('./helpers/GeraToken'); 
const ConsultaFGTS = require('./helpers/fgts/ConsultaFGTS'); 
const VerificarStatus = require('./helpers/VerificarStatus');
const ConsultaDeOperacoesDisponiveis = require('./helpers/inss/ConsultaDeOperacoesDisponiveis');
const SimularValores = require('./helpers/inss/SimularValores');
const CadastroDadosPessoais = require('./helpers/inss/CadastroDadosPessoais');
const CadastroProposta = require('./helpers/inss/CadastroProposta');
const GerarLinkAceite = require('./helpers/inss/GerarLinkAceite');

// Criar um card
app.get('/c6/gera-token', GeraToken, VerificarStatus);
app.get('/c6/consulta-fgts/:cpf', GeraToken, ConsultaFGTS);

// INSS
app.post('/c6/inss/operacoes-disponiveis', GeraToken, ConsultaDeOperacoesDisponiveis);
app.post('/c6/inss/simular-valores', GeraToken, SimularValores);
app.post('/c6/inss/cadastro-dados-pessoais', GeraToken, CadastroDadosPessoais);
app.post('/c6/inss/cadastro-proposta', GeraToken, CadastroProposta);
app.post('/c6/inss/gera-link-aceite', GeraToken, GerarLinkAceite);

module.exports = app;