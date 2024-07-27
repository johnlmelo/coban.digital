const {limparString} = require('../../../../helpers/utils');

const AMBIENTE = process.env.AMBIENTE;
const FACTA_URL = AMBIENTE === "prod" ? process.env.FACTA_URL_PROD : process.env.FACTA_URL_HOM;

const ConsultaFGTS = async (req, res) => {

    const CPF = limparString(req.params.cpf);
    const token = req.query.token;

    if(!CPF || CPF === "" || CPF.lenght < 11) return res.status(300).json(`CPF "${CPF}" inválido`); 
    if(!token || token === "") return res.status(300).json(`TOKEN "${token}" inválido`); 

    const url = FACTA_URL + `/fgts/saldo?cpf=${CPF}`; 


    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!data.erro) {
            return res.status(200).json(data);
        } else {
            return res.status(400).json(data); 
        }
    } catch (error) {
        return res.status(500).json(error);
    }
    
}

module.exports = ConsultaFGTS;