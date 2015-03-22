

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


    /**
     * @param {Account} account The account
     */
    pt.save = function (account) {

        return Promise.resolve(account.psave());

    };


    /**
     * @param {String} id The account id
     * @return {Promise of Account}
     */
    pt.getById = function (id) {

        return Promise.resolve(mongo.Account.findOne({id: id}).exec()).then(function (data) {

            return AccountFactory.getInstance().createFromObject(data);

        });

    };

    pt.getOrCreateByFacebookId = function (facebookId) {
    };

    /**
     * @param {String} ssid The session id
     * @return {Promise of Account}
     */
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


    /**
     * @return {Promise of Array of Account}
     */
    pt.get = function () {

        return Promise.resolve(mongo.Account.find().sort({tomatoCount: -1}).exec());

    };

});

module.exports = AccountRepository;
