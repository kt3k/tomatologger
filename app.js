
var express = require('express');
var chalk = require('chalk');

var app = express();


var server = app.listen(process.env.PORT || 18000, function () {

    var addr = server.address();

    console.log('server started running at %s', chalk.green(addr.address + ':' + addr.port));

});
