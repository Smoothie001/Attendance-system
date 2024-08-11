const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

router.post('/register-admin', authController.registerAdmin);

// Login user
router.get('/login', authController.login);

router.post('/login', authController.login);

// Logout user
router.post('/logout', authController.logout);

module.exports = router;
