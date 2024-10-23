const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AMBIENTE = process.env.AMBIENTE;
const MASTER_URL = AMBIENTE === "prod" ? process.env.MASTER_URL_PROD : process.env.MASTER_URL_HOM;

const obterLimite = async (cpf, convenioId, token) => {

    
    try {
        
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://hml-api-parceiro.bancomaster.com.br/consignado/v1/limite/consultar/${cpf}/${convenioId}`,
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


const consultarLimite = async (req, res) =>  {
    
    const resposta = await obterLimite(req.params.cpf, req.params.convenioId, req.body.token);
    
    const cadastros = {
        res: resposta,
        count: resposta.length
    }
    
    return res.status(200).json(cadastros);
    
}

module.exports = consultarLimite;
