const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const tokenFilePath = path.join(__dirname, 'tokenData.json');
const AMBIENTE = process.env.AMBIENTE;
const PROMO_URL = AMBIENTE === "prod" ? process.env.PROMOSYS_URL_PROD : process.env.PROMOSYS_URL_HOM;
const PROMOSYS_USER = process.env.PROMOSYS_USER;
const PROMOSYS_PASS = process.env.PROMOSYS_PASS;

const GetToken = async (req, res, next) => {
    const url = PROMO_URL + '/services/token.php'; 

    function generateFutureTimestamp() {
        const now = new Date();
        const futureTimestamp = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Adiciona 24 horas
        return futureTimestamp; // Retorna o timestamp em formato ISO
    }

    // Função para ler o token do arquivo
    async function readTokenFile() {
        if (fs.existsSync(tokenFilePath)) {
            return JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
        } else {
            console.log("Arquivo de token não existe!");
        }
        return null;
    }

    // Função para salvar o token no arquivo
    async function saveTokenFile(tokenData) {
        fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData), 'utf8');
    }

    const tokenData = await readTokenFile();
    const verifyData = tokenData && new Date(tokenData.expira) > new Date();

    if (tokenData && tokenData.token && verifyData) {
        console.log('Token existente e válido!', tokenData);
        req.body['token'] = tokenData.token;
        next();
    } else {
        console.log('Token inexistente ou expirado');
        try {
            const data = new FormData();
            data.append('usuario', PROMOSYS_USER);
            data.append('senha', PROMOSYS_PASS);

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    ...data.getHeaders()
                },
                data: data
            };
            
            const getResult = await axios.request(config);
            const result = getResult.data;

            if (result && result.Token) {
                console.log('Novo token obtido', result);
                req.body['token'] = result.Token;
                const newData = { token: result.Token, expira: generateFutureTimestamp() };
                await saveTokenFile(newData);
                next();
            } else {
                throw new Error('Resposta inválida ao obter o token');
            }
        } catch (error) {
            console.error('Erro ao obter o token:', error);
            res.status(500).json({ msg: 'Erro ao consultar beneficios', error: error.message });
        }
    }
};

module.exports = GetToken;
