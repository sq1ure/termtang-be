// models/PurchaseTransaction.js
const mongoose = require('mongoose');

const purchaseTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    paymentMethod: { type: String, enum: ['points', 'trueMoney', 'promptpay'], required: true },
    proofImage: { type: String, required: false },
    adminNote: { type: String }, // For rejected transactions
  },
  { timestamps: true }
);

module.exports = mongoose.model('PurchaseTransaction', purchaseTransactionSchema);
