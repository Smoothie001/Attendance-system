const express = require('express');
const router = express.Router();
// const { authenticate } = require('./middlewares/authMiddleware');
const studentController = require('../controllers/studentController');

router.get('/dashboard', studentController.getStudentData);

module.exports = router;
