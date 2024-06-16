const verificarStatus = async (req, res) =>  {
    
    const resposta = req.query.token;

    console.log('resposta', resposta)

    // Verifica se o status da resposta é 200
    if (resposta != 'Erro') {
        // Retorna o objeto de resposta completo
        return res.status(200).json('Online');
    } else {
        // Retorna uma mensagem de erro com o status
        return res.status(500).json('Offline');
    }
}

module.exports = verificarStatus;