const Course = require('../models/courseModel'); 
const Attendance = require('../models/attendanceModel'); 

// Add a new course
async function addCourse(courseName) {
    const course = new Course({ name: courseName });
    return await course.save();
}

// Get list of courses
async function getCourses() {
    return await Course.find();
}

// Get attendance records
async function getAttendanceRecords() {
    return await Attendance.find();
}

module.exports = {
    addCourse,
    getCourses,
    getAttendanceRecords
};
