# tomato logger v0.0.0

> logging pomodoros in elasticsearch

# How to run

You need to set the following env vars.

```sh
FB_APP_ID=[facbook app id] \
FB_APP_SECRET=[facebook secret] \
MONGO_URI=mongodb://[mongo host]:27017/pomodorometer \
ES_HOST=[elasticsearch host] \
REDIS_HOST=[redis host] \
REDIS_PORT=[redis port] \
SERVICE_HOSTNAME=localhost:18000 \
foreman run web
```
