// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      profilePicture: { type: String },
      googleId: { type: String },    // For Google login
      facebookId: { type: String },    // For Facebook login
      discordId: { type: String },     // For Discord login
      bio: { type: String },
      points: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
