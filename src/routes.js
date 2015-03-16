

var uuid = require('uuid');

var redis = require('./redis');
var mongo = require('./mongo');
var passport = require('./passport');
var esLogger = require('./es-logger');


module.exports = function (app) {
    'use strict';

    var SESSID = 'tssid';

    var initSession = function (req, res) {

        var ssid = req.cookies[SESSID];

        if (!ssid) {

            ssid = uuid.v4();

            res.cookie(SESSID, ssid, {
                maxAge: 14 * 24 * 3600 * 1000 // 2 weeks
            });

        }

        return ssid;

    };

    var auth = function (req, res, next) {

        var ssid = initSession(req, res);

        redis.get(ssid).then(function (account) {

            req.account = account ? JSON.parse(account) : null;

            next();

        }).catch(function (e) {

            console.log(e);
            console.log(e.stack);

            req.account = null;

            next();

        });

    };

    var authRequired = function (req, res, next) {

        if (req.account) {

            next();

            return;

        }

        res.status(401).json({
            status: 401,
            message: 'Unauthrized',
            code: 10001
        });

    };

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', function (req, res, next) {

        passport.authenticate('facebook', function (err, account) {

            if (err) {

                console.log('err');
                console.log(err);
                console.log(err.stack);

                res.redirect('/not_implemented');

                return;

            }

            var ssid = initSession(req, res);

            redis.set(ssid, JSON.stringify(account)).then(function () {

                res.redirect('/');

            });

        })(req, res, next);

    });

    app.put('/api/tomato', auth, authRequired, function (req, res) {

        var params = req.body || {};

        var now = new Date().getTime();

        params.startedAt = now;
        params.createdAt = now;
        params.updatedAt = now;

        params.accountId = req.account.id

        if (params.tags instanceof String) {

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


    app.get('/api/tomato', auth, authRequired, function (req, res) {

        mongo.Tomato.find({accountId: req.account.id}).sort({startedAt: -1}).exec().then(function (tomatoes) {

            res.json({count: tomatoes.length, items: tomatoes});

        });

    });


};
