// Index config file to group all config variables

const redis = require('./redisConfig');
const server = require('./serverConfig');
const db = require('./dbConfig');
const app = require('./appConfig');

module.exports = {
  server,
  redis,
  db,
  app,
};
