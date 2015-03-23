

var uuid = require('uuid');

var redis = require('./redis');
var passport = require('./passport');
var mongo = require('./mongo');

var AccountRepository = require('./api/domain/account-repository');


var SESSID = 'tssid';

var initSession = function (req, res) {

    var ssid = req.cookies[SESSID];

    if (!ssid) {

        ssid = uuid.v4();

        res.cookie(SESSID, ssid, {
            maxAge: 14 * 24 * 3600 * 1000 // 2 weeks
        });

    }

    req.ssid = ssid;

    return ssid;

};

var auth = function (req, res, next) {

    var ssid = initSession(req, res);

    AccountRepository.getInstance().getBySessionId(ssid).then(function (account) {

        req.account= account;

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


var loginRedirect = function (redirect) {
    'use strict';

    return function (req, res, next) {

        if (req.account) {

            res.redirect(redirect);

            return;

        }

        next();

    };

};

var noLoginRedirect = function (redirect) {
    'use strict';

    return function (req, res, next) {

        if (!req.account) {

            res.redirect(redirect);

            return;

        }

        next();

    };

};

var corsOK = function (host) {

    if (!host) {

        host = '*';

    }

    return function (req, res, next) {

        res.append('Access-Control-Allow-Origin', host);

        next();

    };

};

module.exports = auth;
module.exports.required = authRequired;
module.exports.loginRedirect = loginRedirect;
module.exports.noLoginRedirect = noLoginRedirect;
module.exports.corsOK = corsOK;

module.exports.addRoutes = function (app) {
    'use strict';

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

};
