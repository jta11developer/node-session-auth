const redis = require('redis');
const _CONFIG = require('../config');

module.exports = redis.createClient({
  port: _CONFIG.redis.port,
  host: _CONFIG.redis.host,
});
