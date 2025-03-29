const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json()); // Using built-in Express JSON parser

// Optional: Enable CORS if your frontend runs on a different domain
// const cors = require('cors');
// app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
