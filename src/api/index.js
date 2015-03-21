

var mongo = require('../mongo');
var esLogger = require('../es-logger');
var redis = require('../redis');

var auth = require('../auth');

var tomatoFactory = require('./domain/tomato-factory').getInstance();

module.exports.addRoutes = function (app) {
    'use strict';

    app.put('/api/tomato', auth, auth.required, function (req, res) {

        var account = req.account;

        var params = req.body || {};

        params.accountId = account.id

        var tomato = tomatoFactory.createFromObject(params);

        account.tomatoCount = account.tomatoCount || 0;
        account.tomatoCount ++;

        esLogger.info(params);

        Promise.all([

            redis.set(req.ssid, JSON.stringify(account)),
            mongo.Account.findOneAndUpdate({_id: account._id}, account).exec(),
            tomato.psave()

        ]).then(function () {

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


    app.get('/api/accounts/me', auth, auth.required, function (req, res) {

        res.json({account: req.account});

    });


};
