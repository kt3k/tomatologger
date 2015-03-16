
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

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
    name: String
});


module.exports.Tomato = Tomato;
module.exports.Account = Account;
