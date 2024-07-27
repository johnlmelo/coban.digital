const fs = require('fs');
const path = require('path');
const tokenFilePath = path.join(__dirname, 'tokenData.json');
const { transformDateTime } = require('../../../helpers/utils');
const AMBIENTE = process.env.AMBIENTE;
const FACTA_URL = AMBIENTE === "prod" ? process.env.FACTA_URL_PROD : process.env.FACTA_URL_HOM;

const tokenData = {
    token: "",
    expiracao: ""
}

const GetToken = async (req, res, next) => {

    const verifyData = tokenData && new Date(tokenData.expiracao) > new Date();

    if (tokenData && tokenData.token != "" && verifyData) {
        console.log('Token existente e válido!', tokenData);
        req.body['token'] = tokenData.token;
        next();
        return;
    }


    const url = FACTA_URL + '/gera-token';
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + process.env.FACTA_AUTORIZATION
        }
    };

    // Caso o token não exista ou tenha expirado, faz uma nova solicitação
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        req.query['token'] = data.token;
        
        tokenData.token = data.token
        tokenData.expiracao = data.expira
        
        console.log('Token Grado', tokenData);
        return next();
    } catch (error) {
        console.log('Erro ao gerar Token', error)
        return res.status(500).json(error)
    }
    
}

module.exports = GetToken;