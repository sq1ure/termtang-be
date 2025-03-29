// controllers/adminAuthController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Admin Login: Only allow users with role 'admin'
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized. Admin access only.' });
    }

    // Compare provided password with stored password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin Logout: For JWT, logout is handled on the client side.
// This endpoint is optional, but can be used to notify the client.
const adminLogout = (req, res) => {
  // If you are using sessions, you can destroy the session here.
  // For JWT-based authentication, instruct the client to remove the token.
  res.json({ message: 'Admin logged out successfully. Please remove the token on the client side.' });
};

module.exports = { adminLogin, adminLogout };
