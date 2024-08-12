const Course = require('../models/courseModel'); // Ensure this path is correct
const Attendance = require('../models/attendanceModel'); // Ensure this path is correct

// Handler to add a new course
const addCourse = async (req, res) => {
    try {
        const {courseName} = req.body;

        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({message: 'User not authenticated'});
        }

        const course = new Course({
            name: courseName,
            createdBy: req.user._id  // Set the creator of the course
        });

        await course.save();
        res.redirect('/admin-dashboard')
        // res.status(201).json({ message: 'Course added successfully', course });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({message: 'Failed to add course'});
    }
};

// Handler to get all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({courses});
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({message: 'Failed to fetch courses'});
    }
};

// Handler to get attendance records
const getAttendanceRecords = async (req, res) => {
    try {
        const records = await Attendance.find();
        res.status(200).json({records});
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({message: 'Failed to fetch attendance records'});
    }
};

module.exports = {
    addCourse,
    getCourses,
    getAttendanceRecords
};
