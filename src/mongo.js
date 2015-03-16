
var mongoose = require('mongoose');

// polyfill of catch
// https://github.com/aheckmann/mpromise/pull/14
require('mongoose/node_modules/mpromise').prototype.catch = function (onReject) {
    return this.then(undefined, onReject);
};

mongoose.connect(process.env.MONGO_URI);

/**
 * Saves the model and returns a promise
 */
mongoose.Model.prototype.psave = function () {

    var that = this;

    return new Promise(function (resolve) {

        that.save(function (err) {

            if (err) {
                throw err
            }

            resolve();

        });

    });

};


var Tomato = mongoose.model('Tomato', {
    title: String,
    notes: String,
    mood: String,
    performance: Number,
    startedAt: Date,
    endedAt: Date,
    interupted: Boolean,
    finished: Boolean,
    accountId: String
});

var Account = mongoose.model('Account', {
    id: String,
    displayName: String,
    facebookId: String
});

Account.prototype.picture = function () {

    return 'http://graph.facebook.com/' + this.facebookId + '/picture';

};


module.exports.Tomato = Tomato;
module.exports.Account = Account;
