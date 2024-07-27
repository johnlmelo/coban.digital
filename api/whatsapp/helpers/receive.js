const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sequelize = require('../../../config/database');
const Envio = require('../../../models/Envio');

const URL_INTERNA = process.env.URL_INTERNA;

const AMBIENTE = process.env.AMBIENTE;
const PROMO_URL = AMBIENTE === "prod" ? process.env.PROMOSYS_URL_PROD : process.env.PROMOSYS_URL_HOM;

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

function loadBotJson(type) {
  const filePath = path.resolve(`./public/jsons/${type}/bot.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadResJson(type) {
  const filePath = path.resolve(`./public/jsons/${type}/res.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function addNonoDigito(telefone) {
  if (telefone.length > 12) {
    return telefone; // Se o telefone tiver 4 dígitos ou menos, não há nono dígito a remover
  }

  const parteInicial = telefone.slice(0, 4); // Primeiros 4 dígitos
  const parteFinal = telefone.slice(4); // Resto dos dígitos após o nono

  return parteInicial + '9' + parteFinal;
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function substituirVariaveis(mapCampos, valores, urlTemplate) {
  let url = urlTemplate;
  
  mapCampos.forEach(campo => {
    const valor = campo.split('.').reduce((o, i) => (o ? o[i] : ''), valores);
    url = url.replace(`{${campo}}`, valor);
  });

  return url;
}

function formatDate(dateStr) {
  let parts = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-');
  if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
  } else {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
  }
}

module.exports = async (req, res, next) => {
  
  const { body } = req;

  const message = body.message;

  if(message.fromMe){
    console.log('A mensagem é do Sistema!')
    return res.status(200);
  };

  const telefone = addNonoDigito(message.raw.key.remoteJid.split('@')[0]);
  // console.log('message.raw.key.remoteJid.split()[0]',message.raw.key.remoteJid.split('@')[0])
  // console.log('telefone',telefone)
  // console.log('## body ##',body)
  try {

    const envio = await Envio.findOne({ where: { telefone: telefone } });
    if (!envio) {
      console.log('Envio não encontrado!')
      return res.status(404).json({ error: 'Envio não encontrado' });
    }
    // console.log('envio',envio.dataValues)

    const meta = isObject(envio.dataValues.meta) ? envio.dataValues.meta : JSON.parse(envio.dataValues.meta);
    const bot = loadBotJson(envio.dataValues.type);
    const etapaAtual = envio.step;
    const etapa = bot.etapas.find(e => e.etapa === etapaAtual);

    if (!etapa) {
      console.log('Etapa atual não encontrada no bot.json!')
      return res.status(400).json({ error: 'Etapa atual não encontrada no bot.json' });
    }

    // Salvar o dado recebido na meta do envio, se aplicável
    if (etapa.acao.tipo === 'input') {
      meta[etapa.acao.campo] = message.body;
    } else if (etapa.acao.tipo == 'api_call') {

      let apiEndpoint = etapa.acao.endpoint;
      const method = etapa.acao.metodo;
      const mapas = etapa.acao.mapa || [];

      let bodyPoint = {}

      for(const mapa of mapas){

        const valorCampo = meta[mapa];
        
        bodyPoint[mapa] = mapa == "data_nascimento" ? formatDate(valorCampo) : valorCampo;

      }

      console.log('apiEndpoint', apiEndpoint)
      console.log('bodyPoint', bodyPoint)

      try {
        const response = await axios({
          method: method,
          url: `${URL_INTERNA}${apiEndpoint}`,
          data: bodyPoint
        });

        const responseData = response.data;

        console.log('responseData', responseData);

        // Atualizar os campos do meta com os dados recebidos na resposta da API
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            meta[key] = responseData[key];
          }
        }

      } catch (error) {
        console.error('Error calling API:', error);
        return res.status(500).json({ error: 'Erro ao chamar a API' });
      }
      
    }
    

    if(etapa.acao.subetapa){

        

    }


    // Processar a próxima etapa
    const proximaEtapa = bot.etapas.find(e => e.etapa === (etapaAtual + 1));
    if (!proximaEtapa) {
      console.log('Fluxo concluído!')
      return res.status(200).json({ message: 'Fluxo concluído' });
    }

    // Atualizar o meta e a etapa do envio
    meta.etapa = proximaEtapa.etapa;
    await envio.update({
      meta: JSON.stringify(meta),
      step: proximaEtapa.etapa
    });

    console.log('proximaEtapa', proximaEtapa);

    // Enviar a próxima mensagem se não for vazia
    if (proximaEtapa.mensagem) {
      await sendWhats(proximaEtapa.mensagem, telefone);
    }

    res.status(200).json({ message: 'Etapa processada com sucesso' });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Erro ao processar a mensagem' });
  }
};
