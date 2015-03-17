

var auth = require('./auth');


module.exports.addRoutes = function (app) {

    app.use('/login.html', auth, auth.loginRedirect('/main.html'));

    app.use('/main.html', auth, auth.noLoginRedirect('/login.html'));

    app.get('/', function (req, res) {

        res.redirect('/login.html');

    });

};
