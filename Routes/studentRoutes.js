const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
//const authMiddleware = require('../middlewares/authMiddleware');

// Fetch student data
router.get('/dashboard', studentController.getStudentData);

module.exports = router;
