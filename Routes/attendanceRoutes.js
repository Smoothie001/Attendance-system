const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

// Mark attendance
router.post('/attendance',
  authMiddleware.authenticate,
  [
    check('course')
      .notEmpty()
      .withMessage('Course is required')
      .isMongoId()
      .withMessage('Invalid course ID'),
    // Optionally, you can add more validation here for latitude and longitude if needed
    check('latitude')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be a number between -90 and 90'),
    check('longitude')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be a number between -180 and 180'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  attendanceController.markAttendance
);

// Fetch attendance records
router.get('/attendance', authMiddleware.authenticate, attendanceController.getAttendance);

module.exports = router;
