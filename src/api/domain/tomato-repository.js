

var subclass = require('subclassjs');


var TomatoRepository = subclass(function (pt) {

    pt.constructor.getInstance = function () {

        return new this();

    };

    /**
     * Saves the tomato.
     *
     * @param {Tomato} tomato
     * @return {Promise}
     */
    pt.save = function (tomato) {

        return Promise.resolve(tomato.psave());

    };


    /**
     * @param {String} accountId The account id
     */
    pt.getByAccountId = function (accountId) {

        return mongo.Tomato.find({accountId: accountId}).sort({startedAt: -1}).exec().then(function (tomatoes) {

            return tomatoes;

        });

    };

});

module.exports = TomatoRepository;
