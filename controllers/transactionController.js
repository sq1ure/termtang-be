// controllers/transactionController.js
const PurchaseTransaction = require('../models/PurchaseTransaction');

// GET /admin/transactions
// List transactions with optional filters
const getTransactionList = async (req, res) => {
  try {
    const { userId, name, status, paymentMethod, startDate, endDate } = req.query;
    let query = {};
    if (userId) query.userId = userId;
    if (name) query.gameOrCardName = { $regex: name, $options: 'i' };
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const transactions = await PurchaseTransaction.find(query)
      .populate('userId', 'username email');
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /admin/transactions/:id
// Get details of a specific transaction
const getTransactionDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await PurchaseTransaction.findById(id)
      .populate('userId', 'username email')
      .populate('gameId', 'gameName')
      .populate('cardId', 'cardName');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /admin/transactions/:id/confirm
// Confirm (approve) a transaction
const confirmTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await PurchaseTransaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    transaction.status = 'approved';
    await transaction.save();

    // Optionally, update user's points here if needed

    res.json({ message: 'Transaction approved', transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /admin/transactions/:id/reject
// Reject a transaction with an admin note
const rejectTransaction = async (req, res) => {
  const { id } = req.params;
  const { adminNote } = req.body;
  try {
    const transaction = await PurchaseTransaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    transaction.status = 'rejected';
    transaction.adminNote = adminNote;
    await transaction.save();
    res.json({ message: 'Transaction rejected', transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTransactionList,
  getTransactionDetail,
  confirmTransaction,
  rejectTransaction,
};
