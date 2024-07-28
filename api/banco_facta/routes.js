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
app.get('/facta/gera-token', GeraToken, VerificarStatus);
app.get('/facta/consulta-fgts/:cpf', GeraToken, ConsultaFGTS);

// INSS
app.post('/facta/inss/operacoes-disponiveis', GeraToken, ConsultaDeOperacoesDisponiveis);
app.post('/facta/inss/simular-valores', GeraToken, SimularValores);
app.post('/facta/inss/cadastro-dados-pessoais', GeraToken, CadastroDadosPessoais);
app.post('/facta/inss/cadastro-proposta', GeraToken, CadastroProposta);
app.post('/facta/inss/gera-link-aceite', GeraToken, GerarLinkAceite);

module.exports = app;
