require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const createError = require('http-errors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const User = require('./models/userModel');
const Attendance = require('./models/attendanceModel');
const {authenticate, authorize} = require('./middlewares/authMiddleware');
const errorHandler = require('./Middlewares/errorHandler');
const {body} = require('express-validator');
const bparser = require("body-parser");
const cookieParser = require('cookie-parser')
const adminController = require('./controllers/adminController');
const Course = require("./Models/courseModel");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI.replace('localhost', '127.0.0.1'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Middleware
app.use(bparser.urlencoded({extended: true}))
app.use(bparser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

// Set view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', authenticate, authorize(['admin']), courseRoutes);
app.use('/api/attendance', authenticate, attendanceRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);


// Serve HTML pages
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register-admin', (req, res) => {
    res.render('register-admin');
});

app.get('/register-student', (req, res) => {
    res.render('register-student');
});


app.get('/admin-dashboard', authenticate, authorize(['admin']), async (req, res) => {
    res.render('admin-dashboard', {
        courses: await Course.find({}),
        attendanceRecords: await Attendance.find({})
    });
});

app.post('/api/admin/add-course', authenticate, authorize(['admin']), adminController.addCourse);

app.get('/student-dashboard', authenticate, async (req, res, next) => {
    try {
        const student = await User.findById(req.user._id).populate({path: 'courses', strictPopulate: false});

        if (!student) {
            throw createError(404, 'Student not found');
        }

        res.render('student-dashboard', {
            student: student || {},
            courses: await Course.find({})
        });
    } catch (error) {
        console.log({error})
        next(error);
    }
});

// Error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
