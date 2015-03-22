

var esLogger = require('../es-logger');


var auth = require('../auth');


var TomatoCreationService = require('./domain/tomato-creation-service');
var TomatoRepository = require('./domain/tomato-repository');
var AccountRepository = require('./domain/account-repository');



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

        TomatoRepository.getInstance().getByAccountId(req.account.id).then(function (tomatoes) {

            res.json({count: tomatoes.length, items: tomatoes});

        });

    });


    app.get('/api/accounts/me', auth, auth.required, function (req, res) {

        res.json({account: req.account});

    });


    app.get('/api/accounts', function (req, res) {

        AccountRepository.getInstance().get().then(function(accounts) {

            res.json({count: accounts.lenght, items: accounts});

        });

    });

};
