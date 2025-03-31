// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  // Get the token from the Authorization header (e.g., "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify the token using the secret from your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by the decoded token id (excluding the password)
    const user = await User.findById(decoded.id).select('-password');
    console.log('🚀 ~ authenticateToken ~ user:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Attach user info to the request
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { authenticateToken };
