const bcrpt = require('bcrypt');

module.exports = {
  // *** HASH PASSWORD ***
  hashPassword(password) {
    return new Promise((resolve, reject) => {
      resolve(bcrpt.hash(password, 10));
    });
  },

  async comparePasswords(password1, password2) {
    return await bcrpt.compare(password1, password2);
  },

  // COUNT OBJECT KEYS
  verifyObjectNo(obj, no) {
    return Object.keys(obj).length === no;
  },

  verifyObjectKeys(obj, keys = []) {
    let found = true;

    keys.forEach((key) => {
      if (Object.keys(obj).indexOf(key) < 0) found = false;
    });

    return found;
  },

  getError(code, message) {
    return {
      code,
      message,
    };
  },
};
