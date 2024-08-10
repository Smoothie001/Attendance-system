const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// Register a new user
const register = async (req, res) => {
  try {
    console.log(req.body)
  
    let { name, email, password, role, registrationNumber } = req.body;
    if(!registrationNumber) registrationNumber = 100000 * Math.random();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      registrationNumber
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Logout user
const logout = (req, res) => {
  // No action needed for logout if using token-based auth
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  logout
};
