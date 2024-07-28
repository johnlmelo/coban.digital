const Pages = require('./pages');
const FactaBank = require('./banco_facta/routes');
const Promosys = require('./promossis/routes');
// const Whatsapp = require('./whatsapp/routes');

const setupRoutes = (app) => {
    app.use('/', FactaBank);
    app.use('/', Promosys);
    // app.use('/', Whatsapp);
    app.use('/', Pages);
};

module.exports = setupRoutes;