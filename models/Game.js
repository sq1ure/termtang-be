// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },  // Name of the game
    description: { type: String, required: true },  // Description of the game
    genre: { type: String, required: true },  // Genre of the game (e.g., "Action", "RPG")
    releaseDate: { type: Date, required: true },  // Release date of the game
    platform: { type: String, required: true },  // Platform of the game (e.g., "PC", "PlayStation")
    image: { type: String },  // URL to the game's image
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Game', gameSchema);
