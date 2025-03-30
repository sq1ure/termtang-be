// controllers/adminUserController.js
const User = require('../models/User');
const PurchaseTransaction = require('../models/PurchaseTransaction'); // Optional: For listing user's transactions

// GET /admin/users
// List users with optional filters: by name, email, and status (active/inactive)
const getUserList = async (req, res) => {
  try {
    const { name, email, status } = req.query;
    let query = {};
    if (name) query.username = { $regex: name, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (status) {
      if (status.toLowerCase() === 'active') {
        query.isActive = true;
      } else if (status.toLowerCase() === 'inactive') {
        query.isActive = false;
      }
    }
    const users = await User.find(query).select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /admin/users/:id
// Get user details and (optionally) list transactions for that user
const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: Fetch transactions associated with the user
    const transactions = await PurchaseTransaction.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json({ user, transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /admin/users/:id/status
// Update user active/inactive status (active: true, inactive: false)
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User status updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password.' });
    }

    // Check if a user with the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create a new user with the admin role
    const newUser = new User({
      username,
      email,
      password,
      role: 'admin',  // Set the role to admin
    });

    await newUser.save();

    res.status(201).json({ message: 'Admin user created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserList,
  getUserDetail,
  updateUserStatus,
  createAdminUser,
};
