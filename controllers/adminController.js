const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) return res.status(400).json({ error: 'Invalid credentials or not an admin' });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin logout (destroy token)
const logoutAdmin = (req, res) => {
    res.json({ message: 'Admin logged out' });
};

module.exports = { loginAdmin, logoutAdmin };
