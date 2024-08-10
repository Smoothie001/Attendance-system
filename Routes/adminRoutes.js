const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.use(authenticate);


router.post('/add-course', authorize(['admin']), AdminController.addCourse);
router.get('/courses', authorize(['admin']), AdminController.getCourses);
router.get('/attendance', authorize(['admin']), AdminController.getAttendanceRecords);

module.exports = router;
