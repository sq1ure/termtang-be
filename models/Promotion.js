// models/Promotion.js
const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },  // Name of the promotion
        description: { type: String, required: true },  // Description of the promotion
        discountPercentage: { type: Number, required: true },  // Discount percentage for the promotion
        startDate: { type: Date, required: true },  // Start date of the promotion
        endDate: { type: Date, required: true },  // End date of the promotion
        image: { type: String },  // Image URL for the promotion (optional)
        status: { type: String, enum: ['active', 'expired', 'upcoming'], default: 'active' },  // Status of the promotion
    },
    { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Promotion', promotionSchema);
