require('dotenv').config();

module.exports = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  secret: process.env.REDIS_SECRET,
  sessionIdleTimeout: process.env.SESSION_IDLE_TIMEOUT,
  sessionAbsoluteTimeout: process.env.SESSION_ABSOLUTE_TIMEOUT,
};
