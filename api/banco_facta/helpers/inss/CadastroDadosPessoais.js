const AMBIENTE = process.env.AMBIENTE;
const FACTA_URL = AMBIENTE === "prod" ? process.env.FACTA_URL_PROD : process.env.FACTA_URL_HOM;
const axios = require('axios');
const formData = require('form-data');

module.exports = async (req, res, next) => {

    const url = FACTA_URL + '/proposta/etapa2-dados-pessoais';

    const {
        id_simulador, cpf, nome, sexo, estado_civil, data_nascimento, rg, estado_rg, orgao_emissor,
        data_expedicao, estado_natural, cidade_natural, nacionalidade, pais_origem, celular, renda,
        cep, endereco, numero, complemento, bairro, cidade, estado, nome_mae, nome_pai, valor_patrimonio,
        cliente_iletrado_impossibilitado, banco, agencia, conta, matricula, tipo_credito_nb, tipo_beneficio,
        estado_beneficio, banco_pagamento, agencia_pagamento, conta_pagamento, email
    } = req.body;
    
    const {token} = req.query;

    try {

        const data = new formData();
        data.append('id_simulador', id_simulador);
        data.append('cpf', cpf);
        data.append('Nome', nome);
        data.append('sexo', sexo);
        data.append('estado_civil', estado_civil);
        data.append('data_nascimento', data_nascimento);
        data.append('rg', rg);
        data.append('estado_rg', estado_rg);
        data.append('orgao_emissor', orgao_emissor);
        data.append('data_expedicao', data_expedicao);
        data.append('estado_natural', estado_natural);
        data.append('cidade_natural', cidade_natural);
        data.append('nacionalidade', nacionalidade);
        if (pais_origem) data.append('pais_origem', pais_origem);
        data.append('celular', celular);
        data.append('renda', renda);
        data.append('cep', cep);
        data.append('endereco', endereco);
        data.append('numero', numero);
        if (complemento) data.append('complemento', complemento);
        data.append('bairro', bairro);
        data.append('cidade', cidade);
        data.append('estado', estado);
        data.append('nome_mae', nome_mae);
        data.append('nome_pai', nome_pai);
        data.append('valor_patrimonio', valor_patrimonio);
        data.append('cliente_iletrado_impossibilitado', cliente_iletrado_impossibilitado);
        data.append('banco', banco);
        data.append('agencia', agencia);
        data.append('conta', conta);
        data.append('matricula', matricula);
        data.append('tipo_credito_nb', tipo_credito_nb);
        data.append('tipo_beneficio', tipo_beneficio);
        data.append('estado_beneficio', estado_beneficio);
        if (banco_pagamento) data.append('banco_pagamento', banco_pagamento);
        if (agencia_pagamento) data.append('agencia_pagamento', agencia_pagamento);
        if (conta_pagamento) data.append('conta_pagamento', conta_pagamento);
        data.append('email', email);

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
