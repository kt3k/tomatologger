

var esHost = process.env.ES_HOST // elasticsearch host name

var esLogger = require('es-logger').create({

    host: esHost,
    name: 'tomato-data'

});

module.exports = esLogger;
