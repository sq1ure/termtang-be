// models/PurchasePointTransaction.js
const mongoose = require('mongoose');

const PurchasePointTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pointsAmount: { type: Number, required: true },  // The number of points purchased
    paymentMethod: { type: String, required: true },  // e.g., "credit_card", "paypal"
    paymentReceipt: { type: String, required: true },  // URL to the uploaded payment receipt image
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },  // Transaction status
    adminNote: { type: String },  // Admin's note after reviewing the transaction (optional)
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('PurchasePointTransaction', PurchasePointTransactionSchema);
