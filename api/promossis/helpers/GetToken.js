const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const tokenFilePath = path.join(__dirname, 'tokenData.json');
const {transformDateTime} = require('../../../helpers/utils');
const AMBIENTE = process.env.AMBIENTE;
const PROMO_URL = AMBIENTE === "prod" ? process.env.PROMOSYS_URL_PROD : process.env.PROMOSYS_URL_HOM;
const PROMOSYS_USER = AMBIENTE === process.env.PROMOSYS_USER;
const PROMOSYS_PASS = AMBIENTE === process.env.PROMOSYS_PASS;

const GetToken = async (req, res, next) => {

    const url = PROMO_URL + '/services/token.php'; 
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: PROMOSYS_USER,
            senha: PROMOSYS_PASS
        })
    };

    function generateFutureTimestamp() {
        const now = new Date();
        const futureTimestamp = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Adiciona 24 horas
        return futureTimestamp.toISOString(); // Retorna o timestamp em formato ISO
    }

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
                const newData = { token: data.token, expira: generateFutureTimestamp() };
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
