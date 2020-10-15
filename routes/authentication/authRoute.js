const express = require('express');

const router = express.Router();
const { authValidator } = require('../../middleware/validator');
// *** CONTROLLER ***
const authController = require('../../controllers/authController');

// *** REGISTER ROUTE ***
router.post(
  '/register',
  authValidator.registerValidationRules(),
  authValidator.validate,
  authController.register
);

// *** LOGIN ROUTE ***
router.post('/login', authController.login);

// *** LOGOUT ROUTE ***
router.post('/logout', authController.logout);

module.exports = router;
