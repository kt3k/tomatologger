
var subclass = require('subclassjs');
var redis = require('../../redis');


var TomatoCountRepository = subclass(function (pt) {
    'use strict';

    pt.constructor = function (accountId) {
        return this.accountId = accountId;
    };

    pt.constructor.getInstance = function (accountId) {
        return new this(accountId);
    };

    /**
     * @param {Number} count The count
     * @return {Promise}
     */
    pt.save = function (count) {

        count = count || 0;

        return redis.set(this.key(), count.toString());

    };

    /**
     * @return {Promise}
     */
    pt.get = function () {

        return redis.get(this.key()).then(function (value) {
            return +value;
        });

    };

    /**
     * @private
     * @return {String}
     */
    pt.key = function () {

        return 'tomato-count-' + this.accountId;

    };

});

module.exports = TomatoCountRepository;
