

var subclass = require('subclassjs');

var redis = require('../../redis');
var mongo = require('../../mongo');

var TomatoCountRepository = require('./tomato-count-repository');
var AccountFactory = require('./account-factory');


var AccountRepository = subclass(function (pt) {
    'use strict';

    pt.constructor.getInstance = function () {
        return new this();
    };

    pt.save = function (account) {
    };

    pt.getById = function (id) {

        return Promise.resolve(mongo.Account.findOne({id: id}).exec()).then(function (data) {

            return AccountFactory.getInstance().createFromObject(data);

        });

    };

    pt.getOrCreateByFacebookId = function (facebookId) {
    };

    pt.getBySessionId = function (ssid) {

        var that = this;

        return redis.get(ssid).then(function (data) {

            var account = AccountFactory.getInstance().createFromObject(JSON.parse(data));

            if (!account) {

                return null;

            }

            var tcRepo = TomatoCountRepository.getInstance(account.id);

            return tcRepo.get().then(function (count) {

                if (count) {

                    account.tomatoCount = count;

                    return account;

                }

                return that.getById(account.id).then(function (account) {

                    tcRepo.save(account.tomatoCount);

                    return account;

                });

            });

        });

    };

});

module.exports = AccountRepository;
