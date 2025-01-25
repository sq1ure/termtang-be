const jwt = require('jsonwebtoken');
const User = require('./models/User');  // User model

export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from Authorization header
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;  // Attach the decoded user information to the request object
    next();
  });
};
