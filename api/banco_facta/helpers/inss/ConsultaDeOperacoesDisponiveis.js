const {limparString} = require('../../../../helpers/utils');

const AMBIENTE = process.env.AMBIENTE;
const FACTA_URL = AMBIENTE === "prod" ? process.env.FACTA_URL_PROD : process.env.FACTA_URL_HOM;

const ConsultaDeOperacoesDisponiveis = async (req, res) => {

    const CPF = limparString(req.params.cpf);
    const dataDeNascimento = req.params.dataDeNascimento;
    const produto = req.params.produto;
    const tipo_operacao = req.params.tipo_operacao;
    const averbador = req.params.averbador;
    const convenio = req.params.convenio;
    const opcao_valor = req.params.opcao_valor;
    const valor = req.params.valor;
    const parcela = req.params.parcela;
    const prazo = req.params.prazo;
    const token = req.query.token;

    if(!CPF || CPF === "" || CPF.lenght < 11) return res.status(300).json(`CPF "${CPF}" inválido`); 
    if(!token || token === "") return res.status(300).json(`TOKEN "${token}" inválido`); 

    const url = FACTA_URL + `/proposta/operacoes-disponiveis?produto=${produto}&tipo_operacao=${tipo_operacao}&averbador=${averbador}&convenio=${convenio}&opcao_valor=${opcao_valor}&valor=${valor}&valor_parcela=${parcela}&cpf=${CPF}&data_nascimento=${dataDeNascimento}&prazo=${prazo}`;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Cookie", "PHPSESSID=7hlcciqhdsl3k83ht3cnresbbm");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

module.exports = ConsultaDeOperacoesDisponiveis;