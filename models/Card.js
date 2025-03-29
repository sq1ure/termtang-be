// models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    cardName: { type: String, required: true },
    prices: [{ type: Number, required: true }], // Multiple prices
    cardImage: { type: String, required: true }, // URL or file path
    cardInfo: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);
