
var mongo = require('./mongo');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var uuid = require('uuid');


passport.use(new FacebookStrategy({

    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: 'http://localhost:18000/auth/facebook/callback',
    enableProof: false

}, function (accessToken, refreshToken, profile, done) {

    mongo.Account.findOneAndUpdate({

        facebookId: profile.id

    }, {

        id: uuid.v4(),
        displayName: profile.displayName

    }, {

        upsert: true

    }).exec().then(function (account) {

        done(null, account);

    }, function (err) {

        done(err);

    });

}));

module.exports = passport;
