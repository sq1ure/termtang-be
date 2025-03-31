// controllers/clientAuthController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser)
      return res.status(400).json({ message: `User already exists` });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; // identifier can be email or username

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });
    console.log('🚀 ~ loginUser ~ user:', user);

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Logout user
// For JWT-based authentication, logout is handled on the client side by removing the token.
const logoutUser = (req, res) => {
  res.json({
    message:
      "User logged out successfully. Please remove the token on the client side.",
  });
};

// Forgot Password: Send reset link via email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create a JWT token that expires in 1 hour
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Construct the reset link using your FRONTEND_URL
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Please click the following link to reset your password: ${resetLink}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password: Verify token and update password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by email from the decoded token
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and save
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const getProfile = async (req, res) => {
  try {
    // req.user is set by your authentication middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    // Find the authenticated user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update the user's fields if provided in the request body
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

    // Optionally update the password (if provided)
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserPoints = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('🚀 ~ getUserPoints ~ userId:', userId);
    const user = await User.findById(userId).select('points');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ points: user.points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user points' });
  }
};

// Get point history with pagination
const getPointHistory = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const pointHistory = await PointTransaction.find({ userId })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      pointHistory: pointHistory.map(tx => ({
        pointsChange: tx.pointsChange,
        transactionType: tx.transactionType,
        reason: tx.reason,
        createdAt: tx.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching point history' });
  }
};

// Get details of a specific point transaction
const getPointTransactionDetails = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await PointTransaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to view this transaction' });
    }

    res.json({
      transaction: {
        pointsChange: transaction.pointsChange,
        transactionType: transaction.transactionType,
        reason: transaction.reason,
        createdAt: transaction.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching transaction details' });
  }
};

// Purchase points endpoint
const purchasePoints = async (req, res) => {
  // Use multer to handle file upload first
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading payment receipt' });
    }

    const { pointsAmount, paymentMethod } = req.body;

    if (!pointsAmount || !paymentMethod || !req.file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const newTransaction = new PurchaseTransaction({
        userId: req.user._id,
        pointsAmount,
        paymentMethod,
        paymentReceipt: req.file.path,
        status: 'pending',
      });

      await newTransaction.save();

      res.json({
        message: 'Transaction pending for admin review',
        transactionId: newTransaction._id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error processing purchase transaction' });
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  getUserPoints,
  getPointHistory,
  getPointTransactionDetails,
  purchasePoints
};
