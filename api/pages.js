const express = require('express');
const app = express.Router();
const axios = require('axios');
const sequelize = require('../config/database');
const Campaign = require('../models/Campaign');
const Envio = require('../models/Envio');
const fs = require('fs');
const path = require('path');

async function sendWhats(message, number) {
  if (!message) {
    return; // Se a mensagem for uma string vazia, não envia
  }

  var options = {
    method: 'POST',
    url: 'https://enterprise-66api.cj2tech.com.br/v1/api/external/3408304d-ea60-46db-931e-d115af47aef7/',
    params: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6MywicHJvZmlsZSI6ImFkbWluIiwic2Vzc2lvbklkIjoyMiwiY2hhbm5lbFR5cGUiOiJ3aGF0c2FwcCIsImlhdCI6MTcyMDMwNDQzMiwiZXhwIjoxNzgzMzc2NDMyfQ.KXhLmvO0t15BR51tX8cuTmcxkLfIR5Kd9yJLGtcQ2fs'
    },
    headers: {
      Accept: '*/*',
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      'Content-Type': 'application/json'
    },
    data: {
      body: message,
      number: number,
      externalKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6MywicHJvZmlsZSI6ImFkbWluIiwic2Vzc2lvbklkIjoyMiwiY2hhbm5lbFR5cGUiOiJ3aGF0c2FwcCIsImlhdCI6MTcyMDMwNDQzMiwiZXhwIjoxNzgzMzc2NDMyfQ.KXhLmvO0t15BR51tX8cuTmcxkLfIR5Kd9yJLGtcQ2fs'
    }
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {
    return error;
  }
}

// Função para carregar o bot.json correspondente ao type
function loadBotJson(type) {
  const filePath = path.resolve(`./public/jsons/${type}/bot.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Função para carregar o bot.json correspondente ao type
function loadResJson(type) {
  const filePath = path.resolve(`./public/jsons/${type}/res.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Rotas
// Define uma rota que renderiza a página HTML
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/facta/inss', async (req, res) => {
  // const campaigns = await Campaign.findAll();
  res.render('facta-inss', { campaigns: campaigns });
});

app.post('/send-campaign', async (req, res) => {
  const { title, contacts, type } = req.body;
  const contactsSent = contacts.length;
  const opened = 0; // Simula o número de aberturas
  const bot = loadBotJson(type);
  const resposta = loadResJson(type);

  const campaign = await Campaign.create({
    title,
    contactsSent,
    status: 'Enviado',
    opened,
    steps: bot.etapas // Inicializa a meta com a primeira etapa
  });

  const initialStep = bot.etapas[0];
  const message = initialStep.mensagem;

  contacts.forEach(async (contact) => {
    if (message) {
      await sendWhats(message, contact.Telefone);
    }

    await Envio.create({
      nome: contact.Nome,
      telefone: contact.Telefone,
      status: 'Enviado',
      isOpen: false,
      step: 1,
      CampaignId: campaign.id,
      meta: resposta,
      type: title
    });
  });

  res.json(campaign);
});

module.exports = app;
