const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

// Fetch courses
router.get('/courses', authMiddleware.authenticate, courseController.getCourses);

// Add a new course (admin only)
router.post('/add-course', authMiddleware.authenticate, courseController.addCourse);

module.exports = router;
