const User = require('../db/models/UserModel');

function saveNewUser(user) {
  return new Promise((resolve, reject) => {
    const newUser = new User(user);
    newUser.flag = 0;

    newUser.save((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
}

function getUser(query) {
  return new Promise((resolve, reject) => {
    User.findOne(query, (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(user);
    });
  });
}

function deleteUser(query) {
  return new Promise((resolve, reject) => {
    User.deleteOne(query, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      return;
    });
  });
}

function editUser(query, update) {
  return new Promise((resolve, reject) => {
    const options = {
      new: true,
      useFindAndModify: false,
    };
    User.findOneAndUpdate(query, update, options, (err, doc) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(doc);
      return;
    });
  });
}

module.exports = {
  saveNewUser,
  getUser,
  deleteUser,
  editUser,
};
