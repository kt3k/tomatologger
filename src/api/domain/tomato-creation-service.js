

var subclass = require('subclassjs');

var TomatoFactory = require('./tomato-factory');
var TomatoRepository = require('./tomato-repository');
var TomatoCountRepository = require('./tomato-count-repository');

var TomatoCreationService = subclass(function (pt) {
    'use strict';

    /**
     * @param {Account} account
     */
    pt.constructor = function (account) {

        this.account = account;

        if (!this.account) {

            throw new Error('account is not set');

        };

    };


    /**
     * @param {Object} obj The object
     * @return {Tomato}
     */
    pt.createFromObject = function (obj) {

        obj.accountId = this.account.id;

        var tomato = TomatoFactory.getInstance().createFromObject(obj);

        var tomatoCount = this.account.tomatoCount || 0;

        return Promise.all([

            TomatoCountRepository.getInstance(this.account.id).save(tomatoCount + 1),

            mongo.Account.findOneAndUpdate({_id: this.account._id}, {$inc: {tomatoCount: 1}}).exec(),

            TomatoRepository.getInstance().save(tomato)

        ]).then(function () {

            return tomato;

        });

    };

});

module.exports = TomatoCreationService;
