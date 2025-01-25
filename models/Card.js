// models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },  // Name of the card
    description: { type: String, required: true },  // Description of the card
    type: { type: String, required: true },  // Type of the card (e.g., "Rare", "Epic", etc.)
    releaseDate: { type: Date, required: true },  // Release date of the card
    image: { type: String },  // URL to the card's image
    rarity: { type: String, required: true },  // Rarity level of the card (e.g., "Common", "Rare")
    attributes: { type: Map, of: String },  // Any additional attributes specific to the card (e.g., stats, effects)
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Card', cardSchema);
