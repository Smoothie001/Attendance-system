const User = require('../models/userModel');
// const Course = require('../models/courseModel'); // Uncomment if you use courses

const getStudentData = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Optionally fetch courses if needed
   const courses = await Course.find(); // Uncomment if you use courses

    // Pass student and courses data to the view
    res.render('student-dashboard', {
      student, // Ensure 'student' is the correct variable
      courses // Uncomment if you use courses
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    console.log('Student data:', student);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getStudentData
};
