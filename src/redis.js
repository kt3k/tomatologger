

var redis = require('then-redis');

module.exports = redis.createClient({

    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD

});
