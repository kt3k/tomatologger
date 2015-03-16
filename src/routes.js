
var esHost = process.env.ES_HOST // elasticsearch host name

var esLogger = require('es-logger').create({

    host: esHost,
    name: 'tomato-data'

});

var mongo = require('./mongo');


module.exports = function (app) {
    'use strict';

    app.put('/api/tomato', function (req, res) {

        var params = req.body || {};

        var now = new Date().getTime();

        params.startedAt = now;
        params.createdAt = now;
        params.updatedAt = now;

        params.accountId = '1'; // me

        esLogger.info(params);

        var tomato = new mongo.Tomato(params);

        tomato.psave().then(function () {

            res.json(params);

        }).catch(function (err) {

            console.log(err);

            // errorLogger.log(err);

        });

    });


    app.get('/api/tomato', function (req, res) {

        mongo.Tomato.find().sort({startedAt: -1}).exec().then(function (tomatoes) {

            res.json({count: tomatoes.length, items: tomatoes});

        });

    });


};
