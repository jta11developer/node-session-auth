const createError = require('http-errors');
const _CONFIG = require('../config');

const minute = 60000;

function isLoggedIn(req) {
  return req.session.userID;
}

const authenticate = (req, res, next) => {
  // Check if user is authenticated
  // If user is authenticated then allow user through
  // if (!req.session || !req.session.userID) {
  //   throw createError(401, 'You must be logged in!');
  // }
  if (!isLoggedIn(req)) {
    throw createError(401, 'You must be logged in!');
  }
  next();
};

const active = (req, res, next) => {
  if (isLoggedIn(req)) {
    const now = Date.now();
    const { createdAt } = req.session;

    // Check if the session has lived for lnger than the absolute timeout
    if (now > createdAt + +_CONFIG.redis.sessionAbsoluteTimeout * minute) {
      logOut(req, res);

      throw createError(401, 'Session expired!');
    }
  }

  next();
};

module.exports = {
  authenticate,
  active,
};
