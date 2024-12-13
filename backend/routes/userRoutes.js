const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

// These routes will be prefixed with /api/users
router.post('/register', register);
router.post('/login', login);

module.exports = router;

