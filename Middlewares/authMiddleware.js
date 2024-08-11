const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Ensure this path is correct

const authenticate = async (req, res, next) => {
    // const token = req.headers['authorization']?.split(' ')[1];
    const token = req.cookies.token;
    // console.log('Authorization header:', req.headers['authorization']); // Debugging

    console.log('Authorization cookies:', req.cookies); // Debugging

    if (!token) {
        return res.status(401).json({message: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({message: 'User not found'});
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.redirect('/login');
        // res.status(401).json({message: 'Invalid token'});
    }
};

const authorize = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({message: 'Access forbidden: insufficient permissions'});
    }
    next();
};

module.exports = {
    authenticate,
    authorize
};
