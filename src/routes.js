


var auth = require('./auth');

var pages = require('./pages');

var api = require('./api');


module.exports = function (app) {
    'use strict';

    auth.addRoutes(app);

    pages.addRoutes(app);

    api.addRoutes(app);

};
