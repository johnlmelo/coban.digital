const express = require('express');
const app = express.Router();

const Receive = require('./helpers/receive');
const Status = require('./helpers/status');
const Send = require('./helpers/send');

// Rotas
app.post('/webhook/whatsapp/receive', Receive);
app.post('/webhook/whatsapp/status', Status);
app.post('/webhook/whatsapp/send', Send);

module.exports = app;