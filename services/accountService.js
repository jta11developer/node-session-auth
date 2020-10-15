const _ = require('../utils/utils');
const userDAO = require('../dao/user');

function deleteAccount(user) {
  return new Promise((resolve, reject) => {
    // Verify request
    if (
      !_.verifyObjectNo(user, 2) ||
      !_.verifyObjectKeys(user, ['username', 'password'])
    ) {
      reject(_.getError(400, 'Invalid request!'));
      return;
    }

    // Find user in DB
    const { username, password } = user;
    userDAO
      .getUser({ username })
      .then((account) => {
        // Compare password in request with password in DB
        _.comparePasswords(password, account.password).then((match) => {
          if (!match) {
            reject(_.getError(400, 'Incorrect password!'));
            return;
          }

          // If they match permanently delete account
          userDAO
            .deleteUser({ username })
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(_.getError(500, err.message));
            });
        });
      })
      .catch((err) => {
        reject(_.getError(500, err.message));
        return;
      });
  });
}

function editAccount(editObj) {
  return new Promise((resolve, reject) => {
    // User can edit username or password
    // If editing username require new -> username
    if (editObj.edit === 'username') {
      if (
        !_.verifyObjectNo(editObj, 3) ||
        !_.verifyObjectKeys(editObj, ['edit', 'username', 'newusername'])
      ) {
        reject(_.getError(400, 'Invalid request!'));
        return;
      }
    } else if (editObj.edit === 'password') {
      if (
        !_.verifyObjectNo(editObj, 5) ||
        !_.verifyObjectKeys(editObj, [
          'edit',
          'username',
          'password',
          'newpassword',
          'confirmnewpassword',
        ])
      ) {
        reject(_.getError(400, 'Invalid request!'));
        return;
      }
    } else {
      reject(_.getError(400, 'Invalid request!'));
      return;
    }

    // Edit username
    if (editObj.edit === 'username') {
      const { username, newusername } = editObj;
      // Ensure newusername meets standard
      if (newusername.length < 6 || newusername.length > 16) {
        reject(_.getError(400, 'Username must be 6 - 16 characters'));
        return;
      }

      // Change username
      const query = { username };
      const update = { username: newusername };
      userDAO
        .editUser(query, update)
        .then((updatedUser) => {
          const user = {
            user_id: updatedUser._id,
            user_name: updatedUser.username,
            user_email: updatedUser.email,
            user_role: updatedUser.role,
            user_flag: updatedUser.flag,
          };
          resolve(user);
        })
        .catch((err) => {
          reject(err);
          return;
        });
    }

    if (editObj.edit === 'password') {
      const { username, password, newpassword, confirmnewpassword } = editObj;

      // Verify password length
      if (newpassword.length < 6) {
        reject(_.getError(400, 'New password is too short'));
        return;
      }
      // Verify passwords match
      if (newpassword !== confirmnewpassword) {
        reject(_.getError(400, 'New passwords must match'));
        return;
      }
      // Verify new password is different from old password
      if (password === newpassword) {
        reject(_.getError(400, 'New and old passwords must be different'));
        return;
      }

      // Compare that passwords match
      const query = { username };

      userDAO.getUser(query).then((user) => {
        _.comparePasswords(password, user.password).then((match) => {
          if (!match) {
            reject(_.getError(400, 'Password is wrong'));
            return;
          }

          // Update user
          _.hashPassword(newpassword).then((hashedPassword) => {
            const update = { password: hashedPassword };
            userDAO
              .editUser(query, update)
              .then((doc) => {
                const user = {
                  user_id: doc._id,
                  user_name: doc.username,
                  user_email: doc.email,
                  user_role: doc.role,
                  user_flag: doc.flag,
                };
                resolve(user);
                return;
              })
              .catch((err) => {
                reject(_.getError(500, err.message));
                return;
              });
          });
        });
      });
    }
  });
}

module.exports = {
  deleteAccount,
  editAccount,
};
