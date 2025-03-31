const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json()); // Using built-in Express JSON parser

// In your Express server (index.js or app.js)
const cors = require('cors');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Replace with your Next.js app URL
    credentials: true, // if you need to pass cookies or authorization headers
  }));
  


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
