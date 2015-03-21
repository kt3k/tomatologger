require('es6-promise').polyfill();

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var chalk = require('chalk');


var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(function (req, res, next) {

    console.log(req.method + ' ' + req.path);

    next();

});


require('./src/routes')(app);
app.use(express.static('public'));


var server = app.listen(process.env.PORT || 18000, function () {

    var addr = server.address();

    console.log('server started running at %s', chalk.green(addr.address + ':' + addr.port));

});
