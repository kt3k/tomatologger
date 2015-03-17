

var auth = require('./auth');


module.exports.addRoutes = function (app) {

    app.use('/login.html', auth, auth.loginRedirect('/main'));


    app.use('/main.html', auth, auth.noLoginRedirect('/'), function (req, res) {
    });

};
