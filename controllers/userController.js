const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Review = require('./models/Review');
const PointTransaction = require('./models/PointTransaction');
const PurchasePointTransaction = require('./models/PurchasePointTransaction');

dotenv.config();

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.json({ message: 'User logged out successfully' });
    });
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'supavadee112@gmail.com',
        pass: 'ppit pbav tsjw tpmq',
    },
});

const sendResetEmail = (email, token) => {
    const resetLink = `http://localhost:3002/reset-password/${token}`;
    const mailOptions = {
        from: 'supavadee112@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: `Please click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ email: user.email }, 'your-secret-key', { expiresIn: '1h' });
        sendResetEmail(user.email, token);

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        return res.status(500).json({ message: 'Error processing request' });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
};

const reviewCreate = async (req, res) => {
    const { userId, productId, rating, reviewText } = req.body;

    try {
        const newReview = new Review({
            userId,
            productId,
            rating,
            reviewText,
        });

        await newReview.save();

        res.status(200).json({
            message: 'Review added successfully',
            review: newReview,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding review' });
    }
};

const reviewUpdate = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (rating) review.rating = rating;
        if (reviewText) review.reviewText = reviewText;

        await review.save();

        res.json({
            message: 'Review updated successfully',
            review,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating review' });
    }
};

const getProfile = async (req, res) => {
    try {
        // Assume the user is authenticated and user ID is in req.user (from JWT middleware)
        const userId = req.user._id;  // If you're using JWT, the user info should be in req.user

        const user = await User.findById(userId).select('-password');  // Exclude password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};


const updateProfile = async (req, res) => {
    try {
        // Assume the user is authenticated and user ID is in req.user (from JWT middleware)
        const userId = req.user._id;

        const { name, email, profilePicture, bio } = req.body;

        // Find the user and update the profile information
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the profile fields (only the ones provided in the request body)
        if (name) user.name = name;
        if (email) user.email = email;
        if (profilePicture) user.profilePicture = profilePicture;
        if (bio) user.bio = bio;

        await user.save();  // Save the updated user

        res.json({
            message: 'Profile updated successfully',
            user: {
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user profile' });
    }
};

// Function to get user points
const getUserPoints = async (req, res) => {
    try {
        // Assuming the user is authenticated and the user ID is available in req.user (from JWT middleware)
        const userId = req.user._id;

        // Find the user and get the points field
        const user = await User.findById(userId).select('points');  // Select only the points field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the points balance for the user
        res.json({
            points: user.points,  // Return the points value from the user document
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user points' });
    }
};

// Get point history list
const getPointHistory = async (req, res) => {
    const userId = req.user._id;  // From authenticated user (JWT)
    const { page = 1, limit = 10 } = req.query;  // Default to page 1 and limit 10

    try {
        const pointHistory = await PointTransaction.find({ userId })
            .skip((page - 1) * limit)  // Pagination (skip records)
            .limit(limit)  // Limit the number of records per page
            .sort({ createdAt: -1 });  // Sort by most recent first

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

// Get point history details by transactionId
const getPointTransactionDetails = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await PointTransaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check if the transaction belongs to the authenticated user
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

// Configure multer to handle file uploads (payment receipt image)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/receipts');  // Upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Use a timestamp for the filename
    },
});

const upload = multer({ storage }).single('paymentReceipt');  // 'paymentReceipt' is the name of the form field


// Purchase Points API
const purchasePoints = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading payment receipt' });
        }

        const { pointsAmount, paymentMethod } = req.body;

        // Validate the inputs
        if (!pointsAmount || !paymentMethod || !req.file) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new purchase transaction
        try {
            const newTransaction = new PurchaseTransaction({
                userId: req.user._id,  // Assuming user is authenticated
                pointsAmount,
                paymentMethod,
                paymentReceipt: req.file.path,  // Store the file path of the uploaded receipt
                status: 'pending',  // Initially, status is 'pending' until admin review
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
    reviewCreate,
    reviewUpdate,
    getProfile,
    updateProfile,
    getUserPoints,
    getPointHistory,
    getPointTransactionDetails,
    purchasePoints,
};



