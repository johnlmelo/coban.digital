const AMBIENTE = process.env.AMBIENTE;
const FACTA_URL = AMBIENTE === "prod" ? process.env.FACTA_URL_PROD : process.env.FACTA_URL_HOM;
const axios = require('axios');
const formData = require('form-data');
const url = FACTA_URL + '/proposta/envio-link';

module.exports = async (req, res, next) => {

    const {
        codigo_af, tipo_envio
    } = req.body;
    
    const {token} = req.query;

    try {

        const data = new formData();
        data.append('tipo_envio', tipo_envio);
        data.append('codigo_af', codigo_af);

        const requestOptions = {
            method: "POST",
            url: `${url}`,
            headers: {
              "Authorization": `Bearer ${token}`,
              ...data.getHeaders()  // Ensure headers for FormData are set correctly
            },
            data: data
          };

          const response = await axios(requestOptions);
          
          console.log('response', response.data);
          
          res.status(200).json(response.data);

    } catch (error) {
        console.error('Erro ao solicitar beneficios:', error.message, error.stack);
        res.status(500).json({ msg: 'Erro ao solicitar beneficios', error: error.message });
    }
};
