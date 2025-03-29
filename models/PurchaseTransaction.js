// models/PurchaseTransaction.js
const mongoose = require('mongoose');

const purchaseTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Either gameId or cardId may be present, depending on the transaction type
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    gameOrCardName: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    paymentMethod: { type: String, required: true },
    proofImage: { type: String, required: true },
    adminNote: { type: String }, // For rejected transactions
  },
  { timestamps: true }
);

module.exports = mongoose.model('PurchaseTransaction', purchaseTransactionSchema);
