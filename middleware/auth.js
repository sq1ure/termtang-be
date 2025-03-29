// auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model

// Authentication middleware to protect routes
const authenticateToken = async (req, res, next) => {
  try {
    // Get the token from the Authorization header: "Bearer <token>"
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    // Verify token using the secret from the environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optionally, fetch full user details from the database using the ID in the token
    const user = await User.findById(decoded.id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user information to the request object for further use in routes
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
