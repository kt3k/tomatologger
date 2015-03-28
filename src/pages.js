

var auth = require('./auth');


module.exports.addRoutes = function (app) {

    app.use('/login.html', auth, auth.loginRedirect('/home.html'));

    app.use('/home.html', auth, auth.noLoginRedirect('/login.html'));

    app.get('/', function (req, res) {

        res.redirect('/login.html');

    });

};
