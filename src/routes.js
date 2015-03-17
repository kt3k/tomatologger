

var mongo = require('./mongo');
var esLogger = require('./es-logger');

var auth = require('./auth');


module.exports = function (app) {
    'use strict';

    auth.addRoutes(app);

    app.put('/api/tomato', auth, auth.required, function (req, res) {

        var params = req.body || {};

        var now = new Date().getTime();

        params.startedAt = now;
        params.createdAt = now;
        params.updatedAt = now;

        params.accountId = req.account.id

        if (typeof params.tags === 'string') {

            params.tags = params.tags.trim().split(/\s+/);

        }

        esLogger.info(params);

        var tomato = new mongo.Tomato(params);

        tomato.psave().then(function () {

            res.json(params);

        }).catch(function (err) {

            console.log(err);

            // errorLogger.log(err);

        });

    });


    app.get('/api/tomato', auth, auth.required, function (req, res) {

        mongo.Tomato.find({accountId: req.account.id}).sort({startedAt: -1}).exec().then(function (tomatoes) {

            res.json({count: tomatoes.length, items: tomatoes});

        });

    });


    app.get('/api/users/me', auth, auth.required, function (req, res) {

        res.json({account: req.account});

    });


};
