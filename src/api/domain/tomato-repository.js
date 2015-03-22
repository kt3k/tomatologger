

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

});

module.exports = TomatoRepository;
