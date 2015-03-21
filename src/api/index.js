

var mongo = require('../mongo');
var esLogger = require('../es-logger');
var redis = require('../redis');

var auth = require('../auth');

module.exports.addRoutes = function (app) {
    'use strict';

    app.put('/api/tomato', auth, auth.required, function (req, res) {

        var params = req.body || {};

        var now = new Date().getTime();

        var account = req.account;

        params.startedAt = now;
        params.createdAt = now;
        params.updatedAt = now;

        params.privacy = 'friend';

        params.status = 'started';

        params.accountId = account.id

        if (typeof params.tags === 'string') {

            params.tags = params.tags.trim().split(/\s+/);

        }

        var tomato = new mongo.Tomato(params);

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


    app.get('/api/users/me', auth, auth.required, function (req, res) {

        res.json({account: req.account});

    });


};
