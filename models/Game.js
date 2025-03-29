// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameName: { type: String, required: true },
  gameImage: { type: String, required: true }, // URL or path to the image
  gameInfo: { type: String },
  ratePrices: [{ type: Number }], // multiple rate prices (example: [9.99, 19.99])
  gameStatus: { type: String, enum: ['active', 'inactive'], default: 'active' },
  category: { type: String },
  discount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
