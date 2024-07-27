const axios = require('axios');
const FormData = require('form-data');

const AMBIENTE = process.env.AMBIENTE;
const FACTA_URL = AMBIENTE === "prod" ? process.env.FACTA_URL_PROD : process.env.FACTA_URL_HOM;
const PROMO_URL = AMBIENTE === "prod" ? process.env.PROMOSYS_URL_PROD : process.env.PROMOSYS_URL_HOM;

function formatDate(dateStr) {
  let parts = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-');
  if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
  } else {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
  }
}

module.exports = async (req, res, next) => {
  const { token } = req.query;
  const { cpf, dataNascimento, idTipoOperacao, prazo, codigoTabela, contrato, parcela, coeficiente } = req.body;

  console.log('req.token', token);
  console.log('req.body', req.body);

  try {
    const formdata = new FormData();
    formdata.append("produto", "D");
    formdata.append("tipo_operacao", idTipoOperacao);
    formdata.append("averbador", "3");
    formdata.append("convenio", "3");
    formdata.append("cpf", cpf);
    formdata.append("data_nascimento", formatDate(dataNascimento));
    formdata.append("login_certificado", "1234_john");
    formdata.append("prazo", prazo);
    formdata.append("codigo_tabela", codigoTabela);
    formdata.append("valor_operacao", contrato);
    formdata.append("valor_parcela", parcela);
    formdata.append("coeficiente", coeficiente);

    const requestOptions = {
      method: "POST",
      url: `${FACTA_URL}/proposta/etapa1-simulador`,
      headers: {
        "Authorization": `Bearer ${token}`,
        ...formdata.getHeaders()  // Ensure headers for FormData are set correctly
      },
      data: formdata
    };

    const response = await axios(requestOptions);
    console.log('response', response.data);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('error', error);  // Log the error to see more details
    res.status(500).json({ msg: 'Erro ao consultar beneficios', error: error.message });
  }
};
