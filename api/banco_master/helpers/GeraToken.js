const fs = require('fs');
const path = require('path');
const tokenFilePath = path.join(__dirname, 'tokenData.json');
const AMBIENTE = process.env.AMBIENTE;
const MASTER_USUARIO = process.env.MASTER_USUARIO;
const MASTER_SENHA = process.env.MASTER_SENHA;
const MASTER_URL = AMBIENTE === "prod" ? process.env.MASTER_URL_PROD : process.env.MASTER_URL_HOM;

let tokenData = {
    token: "",
    expiracao: ""
};

// Função para carregar o token de um arquivo
const loadTokenData = () => {
    try {
        const data = fs.readFileSync(tokenFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log('Arquivo de token não encontrado ou vazio, criando um novo.');
        return tokenData;
    }
};

// Função para salvar o token em um arquivo
const saveTokenData = (data) => {
    try {
        fs.writeFileSync(tokenFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Token salvo no arquivo.');
    } catch (err) {
        console.error('Erro ao salvar o token no arquivo.', err);
    }
};

const calcularDataFutura = (milissegundos) => {
    const dataAtual = new Date();
    const dataFutura = new Date(dataAtual.getTime() + milissegundos);
    return dataFutura;
};

// Função para obter o token
const obterToken = async () => {
    const url = MASTER_URL + '/token';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "usuario": MASTER_USUARIO,
            "senha": MASTER_SENHA
        })
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Erro ao gerar o token: ${response.statusText}`);
        }

        const data = await response.json();
        tokenData.token = data.accessToken;
        tokenData.expiracao = calcularDataFutura(data.expiresIn);

        // Salva o token no arquivo
        saveTokenData(tokenData);

        return tokenData.token;
    } catch (error) {
        console.error('Erro ao gerar o token', error);
        throw new Error('Erro ao gerar o token');
    }
};

// Função para fazer a requisição à API de convenio-permitido
const consultaConvenioPermitido = async (token) => {
    const url = MASTER_URL + '/consignado/v1/cliente/convenio-permitido';
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await fetch(url, options);

        if (response.status === 200 || response.status === 201) {
            console.log('Consulta realizada com sucesso.');
            return await response.json();
        }

        if (response.status === 401) {
            console.log('Token expirado ou inválido. Necessário gerar um novo token.');
            throw new Error('Token expirado ou inválido');
        }

        throw new Error(`Erro na consulta: ${response.statusText}`);
    } catch (error) {
        console.error('Erro na consulta', error);
        throw error;
    }
};

// Middleware principal
const GetToken = async (req, res, next) => {
    try {
        // Carrega o token salvo no arquivo
        tokenData = loadTokenData();

        // Verifica se o token está presente e se a data de expiração é válida
        const verifyData = tokenData.token;

        if (verifyData) {
            try {
                // Tenta consultar o endpoint para validar se o token é aceito
                await consultaConvenioPermitido(tokenData.token);
                console.log('Token válido. Continuando a requisição com o token existente.');
                req.body['msg'] = 'Token válido. Continuando a requisição com o token existente.';
                req.body['token'] = tokenData.token;
                return next();
            } catch (error) {
                if (error.message === 'Token expirado ou inválido') {
                    console.log('Token inválido após consulta, gerando novo token...');
                } else {
                    return res.status(500).json({ error: 'Erro ao validar o token no endpoint de convenio', details: error.message });
                }
            }
        }

        // Se o token não for válido ou deu erro na consulta, gera um novo token
        console.log('Gerando um novo token...');
        const novoToken = await obterToken();
        req.body['token'] = novoToken;

        next();
    } catch (error) {
        console.error('Erro no processo de obtenção de token ou consulta', error);
        return res.status(500).json({ error: 'Erro no processo de obtenção de token ou consulta', details: error.message });
    }
}

module.exports = GetToken;