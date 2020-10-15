const { promisify } = require('util');
const _ = require('../utils/utils');
const userDAO = require('../dao/user');
const client = require('../db/redisConn');
const { resolve } = require('path');

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

function getError(code, message) {
  return { code, message };
}

function checkPasswordTries(username) {
  return new Promise((resolve, reject) => {
    getTries(username).then((tries) => {
      if (!tries) {
        setTries(username, 1).then(() => {
          reject({
            code: 400,
            message: 'Wrong username or password!',
          });

          return;
        });
      } else {
        const newTries = parseInt(tries) + 1;

        if (newTries > 3) {
          reject({
            code: 400,
            message: 'Account locked! Try again in 30 mins or reset password',
          });
          return;
        }

        setTries(username, newTries).then(() => {
          reject({
            code: 400,
            message: 'Wrong username or password!',
          });
          return;
        });
      }
    });
  });
}

function getTries(username) {
  return new Promise((resolve, reject) => {
    GET_ASYNC(`${username}ptries`).then((tries) => {
      resolve(tries);
    });
  });
}

function setTries(username, tries) {
  return new Promise((resolve, reject) => {
    SET_ASYNC(`${username}ptries`, tries, 'EX', 1800000).then(() => {
      resolve();
    });
  });
}

function createUser(user) {
  return new Promise((resolve, reject) => {
    _.hashPassword(user.password).then((hashedPassword) => {
      user.password = hashedPassword;

      userDAO
        .saveNewUser(user)
        .then((newUser) => {
          resolve(newUser);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

function logUserIn(user) {
  return new Promise((resolve, reject) => {
    // Verify request body
    if (
      !_.verifyObjectNo(user, 2) ||
      !_.verifyObjectKeys(user, ['username', 'password'])
    ) {
      reject({
        code: 400,
        message: 'Invalid request!',
      });
      return;
    }

    // Check db for user
    getUser(user.username).then((singleUser) => {
      // If user is not found
      if (!singleUser) {
        reject({
          code: 404,
          message: 'Wrong username or password!',
        });
        return;
      }

      // Compare passwords
      _.comparePasswords(user.password, singleUser.password).then((match) => {
        if (!match) {
          // If user gets it wrong check cache for triesuserid
          checkPasswordTries(user.username)
            .then(() => {})
            .catch((err) => {
              reject(err);
            });

          return;
        }

        resolve(exportUser(singleUser));
        return;
      });
    });
  });
}

function registerUser(user) {
  return new Promise((resolve, reject) => {
    // Check request body
    if (!_.verifyObjectNo(user, 5)) {
      reject(getError(400, 'Invalid request!'));
      return;
    }
    // Check password and confirm passwords match
    if (user.password !== user.confirmPassword) {
      reject(getError(400, 'Passwords must match'));
      return;
    }

    createUser(user)
      .then((newUser) => {
        resolve(exportUser(newUser));
        return;
      })
      .catch((err) => {
        reject(getError(500, err.message));
        return;
      });
  });
}

function getUser(username) {
  return new Promise((resolve, reject) => {
    userDAO
      .getUser({ username })
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function exportUser(user) {
  return {
    user_id: user._id,
    user_name: user.username,
    user_email: user.email,
    user_role: user.role,
    user_flag: user.flag,
  };
}

module.exports = {
  createUser,
  logUserIn,
  registerUser,
  exportUser,
};
