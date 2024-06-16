const fs = require('fs');
const path = require('path');
const tokenFilePath = path.join(__dirname, 'tokenData.json');
const {transformDateTime} = require('../../../helpers/utils');
const AMBIENTE = process.env.AMBIENTE;
const FACTA_URL = AMBIENTE === "prod" ? process.env.FACTA_URL_PROD : process.env.FACTA_URL_HOM;

const GetToken = async (req, res, next) => {

    const url = FACTA_URL + '/gera-token'; 
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + process.env.FACTA_AUTORIZATION
        }
    };

    // Função para ler o token do arquivo
    function readTokenFile() {
        if (fs.existsSync(tokenFilePath)) {
            return JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
        }
        return null;
    }

    // Função para salvar o token no arquivo
    function saveTokenFile(tokenData) {
        fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData), 'utf8');
    }

    const tokenData = readTokenFile();
    const verifyData =  new Date(transformDateTime(tokenData.expira)) > new Date();

    console.log('verifyData', verifyData);
    console.log('Expiração', new Date(transformDateTime(tokenData.expira)));
    console.log('Hoje', new Date());

    if (tokenData && tokenData.token && verifyData) {
        req.query['token'] = tokenData.token;
        next();
    } else {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (!data.erro) {
                const newData = { token: data.token, expira: data.expira };
                saveTokenFile(newData);
                req.query['token'] = data.token;
            } else {
                req.query['token'] = 'Erro';
            }
            next();
        } catch (error) {
            req.query['token'] = 'Erro';
            next();
        }
    }
}

module.exports = GetToken;
