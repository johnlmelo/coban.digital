const AMBIENTE = process.env.AMBIENTE;
const PROMO_URL = AMBIENTE === "prod" ? process.env.PROMOSYS_URL_PROD : process.env.PROMOSYS_URL_HOM;
const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res, next) => {

    const { message, number } = req.body;

    var axios = require("axios").default;

    var options = {
        method: 'POST',
        url: 'https://enterprise-66api.cj2tech.com.br/v1/api/external/3408304d-ea60-46db-931e-d115af47aef7/',
        params: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6MywicHJvZmlsZSI6ImFkbWluIiwic2Vzc2lvbklkIjoyMiwiY2hhbm5lbFR5cGUiOiJ3aGF0c2FwcCIsImlhdCI6MTcyMDMwNDQzMiwiZXhwIjoxNzgzMzc2NDMyfQ.KXhLmvO0t15BR51tX8cuTmcxkLfIR5Kd9yJLGtcQ2fs'
        },
        headers: {
            Accept: '*/*',
            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
            'Content-Type': 'application/json'
        },
        data: {
            body: message,
            number: number,
            externalKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6MywicHJvZmlsZSI6ImFkbWluIiwic2Vzc2lvbklkIjoyMiwiY2hhbm5lbFR5cGUiOiJ3aGF0c2FwcCIsImlhdCI6MTcyMDMwNDQzMiwiZXhwIjoxNzgzMzc2NDMyfQ.KXhLmvO0t15BR51tX8cuTmcxkLfIR5Kd9yJLGtcQ2fs'
        }
    };

    axios.request(options).then(function (response) {
        res.status(200).json({ body: response });
    }).catch(function (error) {
        res.status(500).json({ body: error });
    });

    res.status(200).json({ body: body });
};