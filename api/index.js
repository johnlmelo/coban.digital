const FactaBank = require('./banco_facta/routes');
const Promosys = require('./promossis/routes');

const setupRoutes = (app) => {
    app.use('/', FactaBank);
    app.use('/', Promosys);
};

module.exports = setupRoutes;