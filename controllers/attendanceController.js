const Attendance = require('../models/attendanceModel');
const { validationResult } = require('express-validator');

// Mark attendance
exports.markAttendance = async (req, res) => {
    try {
      const { course, latitude, longitude } = req.body;
  
      // Validate latitude and longitude (optional, but recommended)
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }
  
      // Rest of your attendance marking logic
      const newAttendance = new Attendance({
        course,
        student: req.user._id,
        latitude,
        longitude
      });
  
      await newAttendance.save();
      res.status(200).json({ message: 'Attendance marked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Get attendance records
exports.getAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate('student', 'name email');

    res.status(200).json({ records: attendanceRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
