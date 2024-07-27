const AMBIENTE = process.env.AMBIENTE;
const PROMO_URL = AMBIENTE === "prod" ? process.env.PROMOSYS_URL_PROD : process.env.PROMOSYS_URL_HOM;
const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res, next) => {

  const { body } = req;

  console.log('Status body', body);

  res.status(200).json({ body: body });

};