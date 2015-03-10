

var tomatoLogger = require('es-logger').create({
    name: 'tomato-data',
    host: process.env.ES_HOST // elasticsearch host name
});

module.exports = function (app) {
    'use strict';

    app.put('/api/tomato', function (req, res) {

        var params = req.body || {};

        console.log(params)

        params.started_at = new Date().getTime();

        params.user_id = '1'; // me

        tomatoLogger.info(params);

        res.json(params);

    });

    app.put('/api/tomato', function (req, res) {
    });

};
