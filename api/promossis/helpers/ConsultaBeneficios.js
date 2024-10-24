const AMBIENTE = process.env.AMBIENTE;
const PROMO_URL = AMBIENTE === "prod" ? process.env.PROMOSYS_URL_PROD : process.env.PROMOSYS_URL_HOM;
const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res, next) => {

  const { cpf } = req.params;
  const { token } = req.body;

  try {
    const data = new FormData();
    data.append('token', token);
    data.append('cpf', cpf);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: PROMO_URL + '/services/beneficios.php',
      headers: { 
        ...data.getHeaders()
      },
      data: data
    };

    const result = await axios.request(config);
    res.json(result.data);

  } catch (error) {
    console.error('Error Details:', {
      message: error.message,
      response: error.response ? error.response.data : 'No response data',
      status: error.response ? error.response.status : 'No response status',
      headers: error.response ? error.response.headers : 'No response headers'
    });
    res.status(500).json({ msg: 'Erro ao consultar beneficios', error: error.message });
  }
};
