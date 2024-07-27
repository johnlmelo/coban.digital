const {limparString, formatDate} = require('../../../../helpers/utils');

const AMBIENTE = process.env.AMBIENTE;
const FACTA_URL = AMBIENTE === "prod" ? process.env.FACTA_URL_PROD : process.env.FACTA_URL_HOM;

async function findLowestTaxRate(data) {
    if (!data.tabelas || data.tabelas.length === 0) return null;

    let minTaxTable = data.tabelas[0];

    data.tabelas.forEach(tabela => {
        if (parseFloat(tabela.taxa) < parseFloat(minTaxTable.taxa)) {
            minTaxTable = tabela;
        }
    });

    return minTaxTable;
}

const ConsultaDeOperacoesDisponiveis = async (req, res) => {

    const CPF = limparString(req.body.cpf);
    const dataDeNascimento = formatDate(req.body.data_nascimento);
    const token = req.query.token;

    if(!CPF || CPF === "" || CPF.lenght < 11) return res.status(300).json(`CPF "${CPF}" inválido`); 
    if(!token || token === "") return res.status(300).json(`TOKEN "${token}" inválido`); 

    const url = FACTA_URL + `/proposta/operacoes-disponiveis?produto=D&tipo_operacao=13&averbador=3&convenio=3&opcao_valor=2&valor_parcela=20&cpf=${CPF}&data_nascimento=${dataDeNascimento}`;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const getOpeacacoes = await fetch(url, requestOptions);
    const operacoes = await getOpeacacoes.json();

    if(operacoes.erro == true){
        return res.status(400).json(operacoes);
    }

    const tabelaSelecionada = await findLowestTaxRate(operacoes);
    res.status(200).json(tabelaSelecionada);
}

module.exports = ConsultaDeOperacoesDisponiveis;