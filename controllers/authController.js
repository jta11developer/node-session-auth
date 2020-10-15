const session = require('../middleware/session');
const userService = require('../services/userService');
const createError = require('http-errors');
const _ = require('../utils/utils');

module.exports = {
  // *** REGISTER ***
  register(req, res, next) {
    userService
      .registerUser(req.body)
      .then((newUser) => {
        req.session.userID = newUser.user_id;
        req.session.createdAt = Date.now();

        res.status(200).json({
          message: 'OK!',
          data: newUser,
        });
      })
      .catch((err) => {
        next(createError(err.code, err.message));
      });

    return;
  },

  // *** LOGIN ***
  login(req, res, next) {
    // const { username, password } = req.body;
    // Validate request body
    userService
      .logUserIn(req.body)
      .then((user) => {
        req.session.userID = user.user_id;
        req.session.createdAt = Date.now();

        res.status(200).json({
          message: 'OK!',
          user,
        });
      })
      .catch((err) => {
        next(createError(err.code, err.message));
      });
    return;
  },

  // *** LOGOUT ***
  logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      res.clearCookie('sessionID').json({
        message: 'OK!',
      });
    });
  },
};
