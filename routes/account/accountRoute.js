const express = require('express');
const router = express.Router();

const accountController = require('../../controllers/accountController');

// *** DELETE ACCOUNT ***
router.post('/delete', accountController.deleteAccount);

// *** EDIT ACCOUNT ***
router.post('/edit', accountController.editAccount);

module.exports = router;
