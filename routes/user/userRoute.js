const express = require('express');

const router = express.Router();

// *** CONTROLLER
const userController = require('../../controllers/userController');

// *** PROFILE ROUTE ***
router.post('/profile', userController.profile);

module.exports = router;
