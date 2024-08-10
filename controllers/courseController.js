const Course = require('../models/courseModel');
const { validationResult } = require('express-validator');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().select('name description'); // Select only necessary fields
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCourses,
  addCourse
};
