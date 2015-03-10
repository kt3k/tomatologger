
var esHost = process.env.ES_HOST // elasticsearch host name

var ES = require('elasticsearch');

var esClient = new ES.Client({

    host: esHost,
    log: 'trace'

});

var tomatoLogger = require('es-logger').create({

    host: esHost,
    name: 'tomato-data'

});


module.exports = function (app) {
    'use strict';

    app.put('/api/tomato', function (req, res) {

        var params = req.body || {};

        params.started_at = new Date().getTime();

        params.user_id = '1'; // me

        tomatoLogger.info(params);

        res.json(params);

    });

    app.get('/api/tomato', function (req, res) {

        esClient.search({

            type: 'logs'

        }).then(function (resp) {

            console.log(resp);

            res.json(resp.hits);

        });

    });

};
