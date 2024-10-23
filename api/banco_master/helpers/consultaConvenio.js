const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AMBIENTE = process.env.AMBIENTE;
const MASTER_URL = AMBIENTE === "prod" ? process.env.MASTER_URL_PROD : process.env.MASTER_URL_HOM;

const obterConvenio = async (cpf, token) => {

    
    try {
        
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://hml-api-parceiro.bancomaster.com.br/consignado/v1/cliente/consulta-cpf?cpfRequest=${cpf}`,
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        };
    
        const response = await axios.request(config);

        const data = response.data;
    
        return data;
    } catch (error) {
        console.error('Erro ao consultar o limite', error);
        return error;
    }
};


const consultaConvenio = async (req, res) =>  {
    
    const resposta = await obterConvenio(req.params.cpf, req.body.token);
    
    const cadastros = {
        res: resposta,
        count: resposta.length
    }
    
    return res.status(200).json(cadastros);
    
}

module.exports = consultaConvenio;
