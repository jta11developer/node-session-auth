const session = require('express-session');
const connectRedis = require('connect-redis');

const _CONFIG = require('../config');
const client = require('../db/redisConn');

const RedisStore = connectRedis(session);

const sessionAbsoluteTimeout = +_CONFIG.redis.sessionAbsoluteTimeout;

module.exports = session({
  store: new RedisStore({ client }),
  secret: _CONFIG.redis.secret,
  saveUninitialized: false,
  resave: false,
  name: 'sessionID',
  rolling: true,
  cookie: {
    maxAge: 60000 * +_CONFIG.redis.sessionIdleTimeout,
    secure: _CONFIG.app.appEnv !== 'dev',
    httpOnly: true,
  },
  // Users can extend session pass the timeout if still logged in
});
