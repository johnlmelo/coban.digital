const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AMBIENTE = process.env.AMBIENTE;
const MASTER_URL = AMBIENTE === "prod" ? process.env.MASTER_URL_PROD : process.env.MASTER_URL_HOM;

const obterLimite = async (cpf, convenioId, token) => {
    const url = MASTER_URL + `/consignado/v1/limite/consultar/${cpf}/${convenioId}`;
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(url, options);

        const data = response.data;
    
        return data;
    } catch (error) {
        console.error('Erro ao consultar o limite', error);
        return 'Erro ao consultar o limite';
    }
};


const consultarLimite = async (req, res) =>  {
    
    console.log("req.body.token", req.body.token);

    const resposta = await obterLimite(req.params.cpf, req.params.convenioId, req.body.token);

    
    const cadastros = {
        res: resposta,
        count: resposta.length
    }
    
    console.log('resposta', cadastros)
    // Verifica se o status da resposta é 200
    return res.status(200).json(cadastros);
    
}

module.exports = consultarLimite;
