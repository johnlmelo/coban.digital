const AMBIENTE = process.env.AMBIENTE;
const PROMO_URL = AMBIENTE === "prod" ? process.env.PROMOSYS_URL_PROD : process.env.PROMOSYS_URL_HOM;
const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res, next) => {

  const { token } = req.body;

  try {

    const data = new FormData();
    data.append('token', token);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: PROMO_URL + '/services/creditos.php',
      headers: { 
        'Content-Type': 'application/json', 
        ...data.getHeaders()
      },
      data : data
    };

    const result = await axios.request(config);

    res.json(result.data);

  } catch (error) {
    res.status(500).json({ msg: 'Erro ao consultar beneficios', error: error });
  }
};
