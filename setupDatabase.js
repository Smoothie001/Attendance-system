const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Define your MongoDB connection string
const mongoURI = process.env.MONGO_URI.replace('localhost', '127.0.0.1');

// Define models for the collections
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, enum: ['student', 'admin'] },
  registrationNumber: String,
  department: String,
  level: String,
  passport: String
});

const courseSchema = new mongoose.Schema({
  name: String,
  description: String,
  instructor: String
});

const attendanceSchema = new mongoose.Schema({
  course: mongoose.Schema.Types.ObjectId,
  student: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  latitude: Number,
  longitude: Number,
  ipAddress: String
});

// Create models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Example: Create a default admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      const newAdmin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        passwordHash: 'hashedpassword', // Replace with a hashed password
        role: 'admin',
        registrationNumber: 'admin001',
        department: 'Admin',
        level: 'N/A'
      });
      await newAdmin.save();
      console.log('Default admin user created');
    }

    // Optionally, add some default courses or other data
    const exampleCourse = await Course.findOne({ name: 'Introduction to Programming' });
    if (!exampleCourse) {
      const newCourse = new Course({
        name: 'Introduction to Programming',
        description: 'A basic course on programming.',
        instructor: 'Jane Smith'
      });
      await newCourse.save();
      console.log('Example course created');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup script
setupDatabase();
