// models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },  // Title of the news article
    description: { type: String, required: true },  // Description of the article
    content: { type: String, required: true },  // Full content of the article
    publicationDate: { type: Date, required: true },  // Publication date of the article
    image: { type: String },  // URL to an image related to the news article (optional)
    author: { type: String },  // Author of the news article (optional)
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('News', newsSchema);
