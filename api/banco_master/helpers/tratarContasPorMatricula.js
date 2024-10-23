const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AMBIENTE = process.env.AMBIENTE;
const MASTER_URL = AMBIENTE === "prod" ? process.env.MASTER_URL_PROD : process.env.MASTER_URL_HOM;

const tratarContasPorMatricula = async (req, res) =>  {
    
    const {contas, matricula} = req.body;

    const filterMatricula = contas.find(item => item.matricula == matricula) || [];
    
    return res.status(200).json({res: filterMatricula});
    
}

module.exports = tratarContasPorMatricula;