// models/PointTransaction.js
const mongoose = require('mongoose');

const pointTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pointsChange: { type: Number, required: true },  // Positive or negative change in points
    transactionType: { type: String, required: true },  // e.g., 'earned' or 'spent'
    reason: { type: String, required: true },  // e.g., 'Review submitted', 'Purchase made'
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('PointTransaction', pointTransactionSchema);
