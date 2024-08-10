const User = require('../models/userModel');

const getStudentData = async (req, res) => {
  try {
  const student = await User.findOne({});

    // res.json(student);
    res.render("student-dashboard", {...student, courses: []})
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getStudentData
};
