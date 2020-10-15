const createError = require('http-errors');
const _ = require('../utils/utils');
const accountService = require('../services/accountService');

module.exports = {
  deleteAccount: (req, res, next) => {
    accountService
      .deleteAccount(req.body)
      .then(() => {
        res.json({
          message: 'OK!',
        });
      })
      .catch((err) => {
        next(createError(err));
        return;
      });
  },

  editAccount: (req, res, next) => {
    accountService
      .editAccount(req.body)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        next(createError(err));
        return;
      });
  },
};
