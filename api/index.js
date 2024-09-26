const Pages = require('./pages');
const FactaBank = require('./banco_facta/routes');
const Promosys = require('./promossis/routes');
const Master = require('./banco_master/routes');
// const Whatsapp = require('./whatsapp/routes');

const setupRoutes = (app) => {
    app.use('/', FactaBank);
    app.use('/', Promosys);
    // app.use('/', Whatsapp);
    app.use('/', Pages);
    app.use('/', Master);
};

module.exports = setupRoutes;


/**
 * @swagger
 * /facta/inss/operacoes-disponiveis:
 *   post:
 *     summary: Passo 1 -> Consulta de operações disponíveis
 *     description: Consulta as operações disponíveis enviando os dados necessários para a API FACTA e retorna a tabela com a maior taxa.
 *     tags:
 *       - Banco FACTA INSS
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Dados do cliente
 *         schema:
 *           type: object
 *           properties:
 *             cpf:
 *               type: string
 *               example: "12345678900"
 *               description: CPF do cliente
 *             data_nascimento:
 *               type: string
 *               format: date
 *               example: "01/01/1990"
 *               description: Data de nascimento do cliente
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       300:
 *         description: CPF inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'CPF "123456789" inválido'
 *       400:
 *         description: Erro ao consultar operações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao consultar operações"
 */



/**
 * @swagger
 * /facta/inss/simular-valores:
 *   post:
 *     summary: Passo 02 -> Simulador de proposta
 *     description: Faz uma simulação de proposta enviando os dados necessários para a API FACTA.
 *     tags:
 *       - Banco FACTA INSS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: "12345678900"
 *                 description: CPF do cliente
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *                 example: "01/01/1990"
 *                 description: Data de nascimento do cliente
 *               idTipoOperacao:
 *                 type: integer
 *                 example: 1
 *                 description: ID do tipo de operação
 *               prazo:
 *                 type: integer
 *                 example: 36
 *                 description: Prazo da operação
 *               codigoTabela:
 *                 type: string
 *                 example: "001"
 *                 description: Código da tabela
 *               contrato:
 *                 type: number
 *                 example: 10000.00
 *                 description: Valor do contrato
 *               parcela:
 *                 type: number
 *                 example: 500.00
 *                 description: Valor da parcela
 *               coeficiente:
 *                 type: number
 *                 example: 1.5
 *                 description: Coeficiente
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       500:
 *         description: Erro ao consultar benefícios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao consultar beneficios"
 *                 error:
 *                   type: string
 *                   example: "Descrição do erro"
 */

/**
 * @swagger
 * /facta/inss/cadastro-dados-pessoais:
 *   post:
 *     summary: Passo 03 -> Envio de dados pessoais
 *     description: Envia dados pessoais necessários para cadastro do cliente via API FACTA.
 *     tags:
 *       - Banco FACTA INSS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_simulador:
 *                 type: string
 *                 example: "123456"
 *               cpf:
 *                 type: string
 *                 example: "12345678900"
 *               nome:
 *                 type: string
 *                 example: "John Doe"
 *               sexo:
 *                 type: string
 *                 example: "M"
 *               estado_civil:
 *                 type: string
 *                 example: "Solteiro"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               rg:
 *                 type: string
 *                 example: "MG1234567"
 *               estado_rg:
 *                 type: string
 *                 example: "MG"
 *               orgao_emissor:
 *                 type: string
 *                 example: "SSP"
 *               data_expedicao:
 *                 type: string
 *                 format: date
 *                 example: "2010-01-01"
 *               estado_natural:
 *                 type: string
 *                 example: "MG"
 *               cidade_natural:
 *                 type: string
 *                 example: "Belo Horizonte"
 *               nacionalidade:
 *                 type: string
 *                 example: "Brasileiro"
 *               pais_origem:
 *                 type: string
 *                 example: "Brasil"
 *               celular:
 *                 type: string
 *                 example: "31999999999"
 *               renda:
 *                 type: number
 *                 example: 5000.00
 *               cep:
 *                 type: string
 *                 example: "30140071"
 *               endereco:
 *                 type: string
 *                 example: "Rua A"
 *               numero:
 *                 type: string
 *                 example: "123"
 *               complemento:
 *                 type: string
 *                 example: "Apto 101"
 *               bairro:
 *                 type: string
 *                 example: "Centro"
 *               cidade:
 *                 type: string
 *                 example: "Belo Horizonte"
 *               estado:
 *                 type: string
 *                 example: "MG"
 *               nome_mae:
 *                 type: string
 *                 example: "Maria Doe"
 *               nome_pai:
 *                 type: string
 *                 example: "Jose Doe"
 *               valor_patrimonio:
 *                 type: number
 *                 example: 100000.00
 *               cliente_iletrado_impossibilitado:
 *                 type: boolean
 *                 example: false
 *               banco:
 *                 type: string
 *                 example: "001"
 *               agencia:
 *                 type: string
 *                 example: "1234"
 *               conta:
 *                 type: string
 *                 example: "123456-7"
 *               matricula:
 *                 type: string
 *                 example: "123456789"
 *               tipo_credito_nb:
 *                 type: string
 *                 example: "1"
 *               tipo_beneficio:
 *                 type: string
 *                 example: "Aposentadoria"
 *               estado_beneficio:
 *                 type: string
 *                 example: "MG"
 *               banco_pagamento:
 *                 type: string
 *                 example: "001"
 *               agencia_pagamento:
 *                 type: string
 *                 example: "1234"
 *               conta_pagamento:
 *                 type: string
 *                 example: "123456-7"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       500:
 *         description: Erro ao solicitar beneficios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao solicitar beneficios"
 *                 error:
 *                   type: string
 *                   example: "Descrição do erro"
 */

/**
 * @swagger
 * /facta/inss/cadastro-proposta:
 *   post:
 *     summary: Passo 04 -> Cadastro de proposta da etapa 3
 *     description: Envia os dados necessários para cadastrar uma proposta na API FACTA.
 *     tags:
 *       - Banco FACTA INSS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_simulador:
 *                 type: string
 *                 example: "123456"
 *                 description: ID do simulador
 *               codigo_cliente:
 *                 type: string
 *                 example: "654321"
 *                 description: Código do cliente
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       500:
 *         description: Erro ao solicitar benefícios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao solicitar benefícios"
 *                 error:
 *                   type: string
 *                   example: "Descrição do erro"
 */


/**
 * @swagger
 * /facta/inss/gera-link-aceite:
 *   post:
 *     summary: Passo 05 -> Envio de link de proposta
 *     description: Gera um link de proposta para o cliente através da API FACTA.
 *     tags:
 *       - Banco FACTA INSS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_envio:
 *                 type: string
 *                 example: "email"
 *                 description: Tipo de envio (email, sms, etc.)
 *               codigo_af:
 *                 type: string
 *                 example: "123456"
 *                 description: Código AF da proposta
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       500:
 *         description: Erro ao solicitar benefícios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro ao solicitar benefícios"
 *                 error:
 *                   type: string
 *                   example: "Descrição do erro"
 */
