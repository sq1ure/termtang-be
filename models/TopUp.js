// models/TopUp.js
const mongoose = require('mongoose');

const topUpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['points', 'trueMoney', 'promptpay'], required: true },
    paymentReceipt: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
    transactionDate: { type: Date, default: Date.now },
    gameId: { type: String },
    cardId: { type: String },
    gameUserId: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TopUp', topUpSchema);
