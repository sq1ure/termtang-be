// controllers/transactionController.js
const PurchaseTransaction = require('../models/PurchaseTransaction');

// GET /admin/transactions
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
      .populate('userId', 'username')
      // Populate the game reference if exists; assume the game collection has gameName
      .populate('gameId', 'gameName')
      // Populate the card reference if exists; assume the card collection has cardName
      .populate('cardId', 'cardName');

    const mappedTransactions = transactions.map((tx) => ({
      transactionId: tx._id,
      user: {
        userId: tx.userId ? tx.userId._id : "",
        username: tx.userId ? tx.userId.username : "",
      },
      game: tx.gameId
        ? {
            gameId: tx.gameId._id,
            gameName: tx.gameId.gameName,
          }
        : {},
      card: tx.cardId
        ? {
            cardId: tx.cardId._id,
            cardName: tx.cardId.cardName,
          }
        : {},
      amount: tx.amount,
      status: tx.status,
      paymentMethod: tx.paymentMethod,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));

    res.json(mappedTransactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /admin/transactions/:id
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

    // Map the transaction document to the desired data structure
    const mappedTransaction = {
      transactionId: transaction._id,
      user: {
        userId: transaction.userId ? transaction.userId._id : "",
        username: transaction.userId ? transaction.userId.username : "",
        email: transaction.userId ? transaction.userId.email : "",
      },
      game: transaction.gameId
        ? {
            gameId: transaction.gameId._id,
            gameName: transaction.gameId.gameName,
          }
        : {},
      card: transaction.cardId
        ? {
            cardId: transaction.cardId._id,
            cardName: transaction.cardId.cardName,
          }
        : {},
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      proofImage: transaction.proofImage,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };

    res.json(mappedTransaction);
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
