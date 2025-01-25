// models/TopUp.js
const mongoose = require('mongoose');

const topUpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['credit_card', 'bank_transfer', 'paypal'], required: true },
    paymentReceipt: { type: String },  // URL to the payment receipt image (optional, initially null)
    status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TopUp', topUpSchema);
