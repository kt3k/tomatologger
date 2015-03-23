


var auth = require('./auth');

var pages = require('./pages');

var api = require('./api');


module.exports = function (app) {
    'use strict';

    if (process.env.APP_STATE !== 'production') {
        app.use(auth.corsOK());
    };

    auth.addRoutes(app);

    pages.addRoutes(app);

    api.addRoutes(app);

};
