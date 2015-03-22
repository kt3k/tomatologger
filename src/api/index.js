

var mongo = require('../mongo');
var esLogger = require('../es-logger');
var redis = require('../redis');

var auth = require('../auth');

var TomatoCreationService = require('./domain/tomato-creation-service');

module.exports.addRoutes = function (app) {
    'use strict';

    app.put('/api/tomato', auth, auth.required, function (req, res) {

        var account = req.account;

        var params = req.body || {};

        esLogger.info(params);

        var tcService = new TomatoCreationService(req.account);

        tcService.createFromObject(params).then(function (tomato) {

            res.json(tomato);

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


    app.get('/api/accounts/me', auth, auth.required, function (req, res) {

        res.json({account: req.account});

    });


};
