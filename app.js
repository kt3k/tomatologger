
var express = require('express');
var bodyParser = require('body-parser');
var chalk = require('chalk');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app);

var server = app.listen(process.env.PORT || 18000, function () {

    var addr = server.address();

    console.log('server started running at %s', chalk.green(addr.address + ':' + addr.port));

});
