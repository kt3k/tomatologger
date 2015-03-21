
var subclass = require('subclassjs');


var mongo = require('../../mongo');


var AccountFactory = subclass(function (pt) {
    'use strict';

    pt.constructor.getInstance = function () {

        return new this();

    };


    pt.createFromObject = function (obj) {

        if (!obj) {

            return null;

        }

        return new mongo.Account(obj);

    };

});

module.exports = AccountFactory;
